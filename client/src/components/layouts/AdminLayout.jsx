import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../navBar/SideBar.js';
import Header from '../navBar/Header.js';

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <SideBar/>
      <div className="admin-body">
        <Header />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default AdminLayout;
