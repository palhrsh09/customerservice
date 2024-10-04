import React, { useState } from 'react';
import axios from 'axios';

const CreateTicketForm = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    issue: '',
    description: '',
    assignedTo: '',
    createdBy : ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Get the userId from localStorage
    const userId = localStorage.getItem("userId");
  
    const { assignedTo, ...dataToSend } = formData;
    const data = {
      ...dataToSend,
      ...(assignedTo ? { assignedTo } : {}),
      createdBy: userId // Add createdBy field from localStorage
    };
  
    try {
      const response = await axios.post('http://localhost:5000/api/ticket/create', data);
      setSuccess('Ticket created successfully!');
      setError('');
  
      // Reset form
      setFormData({
        customerName: '',
        email: '',
        issue: '',
        description: '',
        assignedTo: '',
        createdBy: '' // Optionally clear this field after successful creation
      });
    } catch (error) {
      setError('Error creating ticket. Please try again.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-blue-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg transition-transform transform hover:scale-105">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Create a Ticket</h2>
        
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 font-medium" htmlFor="customerName">Customer Name</label>
            <input
              id="customerName"
              name="customerName"
              type="text"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1 font-medium" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1 font-medium" htmlFor="issue">Issue</label>
            <input
              id="issue"
              name="issue"
              type="text"
              value={formData.issue}
              onChange={handleChange}
              placeholder="Briefly describe your issue"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1 font-medium" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide more details about your issue"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1 font-medium" htmlFor="assignedTo">Assigned To (Optional)</label>
            <input
              id="assignedTo"
              name="assignedTo"
              type="text"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="Assign to a specific agent (optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${loading && 'opacity-50'}`}
            disabled={loading}
          >
            {loading ? 'Creating Ticket...' : 'Create Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketForm;
