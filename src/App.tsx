import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Employees from './pages/Employees'
import EmployeeProfile from './pages/EmployeeProfile'

import Attendance from './pages/Attendance'
import Overtime from './pages/Overtime'
import Holidays from './pages/Holidays'
import Payroll from './pages/Payroll'
import Reports from './pages/Reports'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employee-profile/:id" element={<EmployeeProfile />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/overtime" element={<Overtime />} />
        <Route path="/holidays" element={<Holidays />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
