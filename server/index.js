const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors");
const { connectDB } = require('./Components/Middleware/dbConnect');

// Models — init functions
const { initStaffTable }         = require('./Components/Model/userModel');
const { initStudentsTable }      = require('./Components/Model/studentModel');
const { initVisitsTable }        = require('./Components/Model/visitModel');
const { initMedicinesTable }     = require('./Components/Model/medicineModel');
const { initPrescriptionsTable } = require('./Components/Model/prescriptionModel');
const { initTreatmentsTable }      = require('./Components/Model/treatmentModel');
const { initNotificationsTable,
        generateSystemNotifications } = require('./Components/Model/notificationModel');

// Routes
const userRoutes             = require('./Components/Router/userRoutes');
const studentRoutes          = require('./Components/Router/studentRoutes');
const visitRoutes            = require('./Components/Router/visitRoutes');
const medicineRoutes         = require('./Components/Router/medicineRoutes');
const prescriptionRoutes     = require('./Components/Router/prescriptionRoutes');
const treatmentRoutes        = require('./Components/Router/treatmentRoutes');
const notificationRoutes     = require('./Components/Router/notificationRoutes');
const statisticsRoutes       = require('./Components/Router/statisticsRoutes');

const app = express()
const port = process.env.PORT || 5000;

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Routes
app.use('/api/staff',         userRoutes);
app.use('/api/students',      studentRoutes);
app.use('/api/visits',        visitRoutes);
app.use('/api/medicines',     medicineRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/treatments',    treatmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/statistics',    statisticsRoutes);

// Listen on enviroment port or 5000
async function startServer() {
  await connectDB();

  // Init tables in FK dependency order
  await initStaffTable();
  await initStudentsTable();
  await initVisitsTable();        // depends on staff + students
  await initMedicinesTable();
  await initPrescriptionsTable(); // depends on visits + medicines
  await initTreatmentsTable();    // depends on visits
  await initNotificationsTable();
  await generateSystemNotifications();

  app.listen(port, () => console.log(`Server running on port ${port}`));
}

startServer();