const { getDB } = require('../Middleware/dbConnect');

async function initNotificationsTable() {
  const db = getDB();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS notifications (
      notification_id INT(11)      NOT NULL AUTO_INCREMENT PRIMARY KEY,
      type            ENUM('urgent','warning','info','success') DEFAULT 'info',
      icon            VARCHAR(60)  DEFAULT 'notifications',
      title           VARCHAR(255) NOT NULL,
      description     TEXT         DEFAULT NULL,
      is_read         TINYINT(1)   DEFAULT 0,
      source          VARCHAR(50)  DEFAULT NULL,
      source_id       INT(11)      DEFAULT NULL,
      created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  `);
  console.log('notifications table ready');
}

async function findAllNotifications() {
  const db = getDB();
  const [rows] = await db.query(`SELECT * FROM notifications ORDER BY created_at DESC`);
  return rows;
}

async function createNotification({ type, icon, title, description, source, source_id }) {
  const db = getDB();
  const [result] = await db.execute(
    `INSERT INTO notifications (type, icon, title, description, source, source_id) VALUES (?, ?, ?, ?, ?, ?)`,
    [type ?? 'info', icon ?? 'notifications', title, description ?? null, source ?? null, source_id ?? null]
  );
  return result.insertId;
}

async function markAsRead(id) {
  const db = getDB();
  const [result] = await db.execute(
    `UPDATE notifications SET is_read = 1 WHERE notification_id = ?`, [id]
  );
  return result.affectedRows;
}

async function markAllAsRead() {
  const db = getDB();
  await db.execute(`UPDATE notifications SET is_read = 1`);
}

async function deleteNotification(id) {
  const db = getDB();
  const [result] = await db.execute(
    `DELETE FROM notifications WHERE notification_id = ?`, [id]
  );
  return result.affectedRows;
}

// Runs on server startup — syncs medicine-based system notifications
async function generateSystemNotifications() {
  const db = getDB();
  const [medicines] = await db.query(`SELECT * FROM medicines`);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in30Days = new Date(today);
  in30Days.setDate(in30Days.getDate() + 30);

  for (const med of medicines) {
    // ── LOW STOCK / OUT OF STOCK ──────────────────────────────────────────
    const [existingLow] = await db.execute(
      `SELECT notification_id FROM notifications WHERE source = 'low_stock' AND source_id = ? AND is_read = 0`,
      [med.medicine_id]
    );

    if (med.stock_quantity === 0) {
      if (existingLow.length === 0) {
        await createNotification({
          type: 'urgent',
          icon: 'inventory_2',
          title: `Out of Stock: ${med.name}`,
          description: `${med.name} has 0 units remaining. Immediate restocking required.`,
          source: 'low_stock',
          source_id: med.medicine_id,
        });
      }
    } else if (med.stock_quantity <= 20) {
      if (existingLow.length === 0) {
        await createNotification({
          type: 'warning',
          icon: 'inventory_2',
          title: `Low Stock: ${med.name}`,
          description: `Only ${med.stock_quantity} unit${med.stock_quantity !== 1 ? 's' : ''} of ${med.name} remaining. Consider restocking.`,
          source: 'low_stock',
          source_id: med.medicine_id,
        });
      }
    } else {
      // Stock restored — remove any stale unread low_stock notification
      if (existingLow.length > 0) {
        await db.execute(
          `DELETE FROM notifications WHERE source = 'low_stock' AND source_id = ? AND is_read = 0`,
          [med.medicine_id]
        );
      }
    }

    // ── EXPIRY ────────────────────────────────────────────────────────────
    if (!med.expiration_date) continue;

    const expDate = new Date(med.expiration_date);
    expDate.setHours(0, 0, 0, 0);

    const [existingExp] = await db.execute(
      `SELECT notification_id FROM notifications WHERE source = 'expiry' AND source_id = ? AND is_read = 0`,
      [med.medicine_id]
    );

    const fmtDate = expDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (expDate < today) {
      if (existingExp.length === 0) {
        await createNotification({
          type: 'urgent',
          icon: 'warning',
          title: `Expired: ${med.name}`,
          description: `${med.name} expired on ${fmtDate}. Remove from inventory immediately.`,
          source: 'expiry',
          source_id: med.medicine_id,
        });
      }
    } else if (expDate <= in30Days) {
      const daysLeft = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
      if (existingExp.length === 0) {
        await createNotification({
          type: 'warning',
          icon: 'event_busy',
          title: `Expiring Soon: ${med.name}`,
          description: `${med.name} expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''} (${fmtDate}). Plan accordingly.`,
          source: 'expiry',
          source_id: med.medicine_id,
        });
      }
    } else {
      // No longer expiring soon — clean up stale notification
      if (existingExp.length > 0) {
        await db.execute(
          `DELETE FROM notifications WHERE source = 'expiry' AND source_id = ? AND is_read = 0`,
          [med.medicine_id]
        );
      }
    }
  }

  console.log('System notifications generated');
}

module.exports = {
  initNotificationsTable,
  findAllNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  generateSystemNotifications,
};
