import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LoginForm from './Components/Login';
import SignupForm from './Components/Signup';
import { Dashboard } from './Components/Dashboard';
import SingleTicket from "./Components/Ticket/SingleTicket";
import Header from './Components/Ticket/Header'; 

function App() {
  // State to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(token !== null);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);  // Update the state to reflect the logout
  };

  const user = localStorage.getItem("role");

  return (
    <Router>
      {isAuthenticated && <Header onLogout={handleLogout} />}  {/* Pass onLogout prop to Header */}
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginForm />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignupForm />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/tickets/:ticketId" 
          element={isAuthenticated ? <SingleTicket /> : <Navigate to="/" />} 
        />
        <Route 
          path="*" 
          element={<Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
