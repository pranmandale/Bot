import React from 'react';
import {  Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Bot from '../components/Bot';
import Signup from '../pages/Signup';

const AppRoutes = ({ isAuthenticated }) => {
  return (
    <Routes>
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/bot" /> : <Signup />} />
      <Route 
        path="/" 
        element={!isAuthenticated ? <Login /> : <Navigate to="/bot" />} 
      />
      <Route 
        path="/bot" 
        element={isAuthenticated ? <Bot /> : <Navigate to="/" />} 
      />
    </Routes>
  );
};

export default AppRoutes;
