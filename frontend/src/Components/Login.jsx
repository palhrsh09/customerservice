import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');  // Change username to email
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // Default role can be 'customer'
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { data } = await axios.post('http://localhost:5000/api/agent/login', { email, password }); // Use email instead of username
      localStorage.setItem('token', data.token); // Store token for authentication
      localStorage.setItem('role', data.role); // Store role for later use
      localStorage.setItem('userId', data.userId);
      // Redirect based on role
      if (data.role ) {
        // Redirect to agent dashboard
        navigate("/dashboard")
      } 
    } catch (error) {
      console.error('Login failed:', error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Login</h2>

        <div className="mb-4">
          <label className="block text-gray-600 mb-2" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 mb-2" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>

        <div className="flex flex-col items-center justify-center mt-4">
          <p className="text-gray-600 text-sm">Not a user?</p>
          <h5
            className="text-blue-500 text-sm font-semibold underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up here
          </h5>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
