import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import Overtime from './pages/Overtime'
import Holidays from './pages/Holidays'
import Payroll from './pages/Payroll'
import Reports from './pages/Reports'
import EmployeeProfile from './pages/EmployeeProfile'

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const userString = localStorage.getItem('user');

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const user = userString ? JSON.parse(userString) : null;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Admin /></ProtectedRoute>} />
        <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
        <Route path="/employee-profile/:id" element={<ProtectedRoute><EmployeeProfile /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
        <Route path="/overtime" element={<ProtectedRoute><Overtime /></ProtectedRoute>} />
        <Route path="/holidays" element={<ProtectedRoute><Holidays /></ProtectedRoute>} />
        <Route path="/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute allowedRoles={['admin']}><Reports /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App
