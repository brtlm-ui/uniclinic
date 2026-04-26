import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import ProtectedRoutes, { RoleRoute } from "./components/config/ProtectedRoutes";
import AdminLayout from "./components/layouts/AdminLayout";

import AddEditVisit from './components/pages/AddEditVisit';
import Medicines from './components/pages/Medicines';
import StaffManagement from './components/pages/StaffManagement';
import Dashboard from './components/pages/Dashboard';
import Treatments from './components/pages/Treatments';
import Prescriptions from './components/pages/Prescriptions';
import Login from './components/pages/Login';
import Students from './components/pages/Students';
import Reports from './components/pages/Reports';
import Visits from './components/pages/Visits';
import Notifications from './components/pages/Notifications';
import Settings from './components/pages/Settings';
import Profile from './components/pages/Profile';
import NotFound from './components/pages/NotFound';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/treatments" element={<Treatments />} />
            <Route path="/prescriptions" element={<Prescriptions />} />
            <Route path="/students" element={<Students />} />
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route path="/reports" element={<Reports />} />
              <Route path="/staff" element={<StaffManagement />} />
            </Route>
            <Route path="/visits" element={<Visits />} />
            <Route path="/visits/add-edit" element={<AddEditVisit />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
