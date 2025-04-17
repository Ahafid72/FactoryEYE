import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview'; // Admin dashboard
import Projects from './pages/Projects';
import Equipment from './pages/Equipment';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Users from './pages/Users';
import Header from './components/header';
import AddSensor from './pages/AddSensor';
import ReportsExport from './pages/ReportsExport';
import UserDashboard from './pages/UserDashboard';
import AdminProjects from './pages/AdminProjects';
import './App.css';
import UserEquipment from './pages/UserEquipment';


// 👇 Shared layout with Header & Sidebar
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return isAuthenticated ? (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0f172a] text-black dark:text-white flex flex-col">
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

function App() {
  const role = localStorage.getItem('role'); // 👈 Stored during login (admin or user)

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          localStorage.getItem('role') === 'user' 
            ? <Navigate to={`/user/${localStorage.getItem('userId')}`} /> 
            : <PrivateRoute><Overview /></PrivateRoute>
        } />
        <Route path="/user/:userId" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
        <Route path="/projects" element={ <PrivateRoute>  {role === 'admin' ? <AdminProjects /> : <Projects />}
    </PrivateRoute>  } /> 

    <Route path="/equipment" element={
    <PrivateRoute>
      {role === 'user' ? <UserEquipment /> : <Equipment />}
    </PrivateRoute>
  }
/>


        {/* Other admin routes */}
        <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
        <Route path="/equipment" element={<PrivateRoute><Equipment /></PrivateRoute>} />
        <Route path="/alerts" element={<PrivateRoute><Alerts /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
        <Route path="/addsensor" element={<PrivateRoute><AddSensor /></PrivateRoute>} />
        <Route path="/export" element={<PrivateRoute><ReportsExport /></PrivateRoute>} />
    </Routes>

    </Router>
  );
}

export default App;
