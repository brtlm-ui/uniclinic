import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/staff" element={<StaffManagement />} />
        <Route path="/treatments" element={<Treatments />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/students" element={<Students />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/visits" element={<Visits />} />
        <Route path="/visits/add-edit" element={<AddEditVisit />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App; 
