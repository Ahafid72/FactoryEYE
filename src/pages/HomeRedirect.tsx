// src/pages/HomeRedirect.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const HomeRedirect = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const role = localStorage.getItem("role");

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return role === "ADMIN" ? <Navigate to="/overview" /> : <Navigate to="/user-dashboard" />;
};

export default HomeRedirect;
