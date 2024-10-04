import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SingleTicket = () => {
  const { ticketId } = useParams(); // Get ticketId from route parameters

  const [ticket, setTicket] = useState(null); // To store the fetched ticket
  const [conversation, setConversation] = useState([]);
  const [reply, setReply] = useState('');
  const [status, setStatus] = useState('open');
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch the ticket details when the component mounts or ticketId changes
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/ticket/${ticketId}`); // Fetch by ticketId
        const ticketData = response.data;

        setTicket(ticketData);
        setConversation(ticketData.communication || []);
        setStatus(ticketData.status || 'open');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ticket:', error);
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]); // Dependency on ticketId

  
  // Submit a reply
  const handleReplySubmit = async () => {
    try {
      const newMessage = {
        sender: localStorage.getItem("role"), // Sender's role
        message: reply,
        date: new Date().toISOString(),
      };
      
      const ticketId = ticket?.ticketId
     
      // Use PATCH to update the conversation field only
      const updatedTicket = await axios.patch(`http://localhost:5000/api/ticket/${ticketId}/reply`, newMessage);
      setConversation(updatedTicket.data.conversation);  // Update the conversation with the new reply
      setReply('');
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    try {
      const ticketId = ticket?._id
       const role = localStorage.getItem("role")
      const updatedTicket = await axios.patch(`http://localhost:5000/api/ticket/${ticketId}/status`, { status: newStatus ,role });
      setStatus(updatedTicket.data.status);  // Update the status in state
    } catch (error) {
      console.error('Error changing status:', error);
    }
  };

  // Handle loading and no ticket found
  if (loading) {
    return <p>Loading ticket details...</p>;
  }

  if (!ticket) {
    return <p>Ticket not found</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-blue-50 rounded-lg border border-blue-200 shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow duration-300">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{ticket.issue}</h3>
          <span className={`text-white text-sm font-medium px-2 py-1 rounded-full ${status === 'open' ? 'bg-green-500' : 'bg-red-500'}`}>
            {status}
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-gray-600"><strong>Customer:</strong> {ticket.customerName}</p>
          <p className="text-gray-600"><strong>Email:</strong> {ticket.email}</p>
          <p className="text-gray-600"><strong>Ticket ID:</strong> {ticket._id}</p>
          <p className="text-gray-600"><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
        </div>

        <div className="mt-4">
          <h4 className="font-medium text-gray-700 mb-2">Description:</h4>
          <p className="text-gray-600">{ticket.description}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h4 className="font-medium text-gray-700 mb-4">Conversation</h4>
        <div className="space-y-4 mb-4">
          {conversation?.map((msg, index) => (
            <div key={msg?._id} className={`p-3 rounded-lg shadow-sm ${msg?.sender === 'Agent' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <p className="text-gray-700"><strong>{msg?.sender}:</strong> {msg?.content}</p>
              <span className="text-xs text-gray-500">{new Date(msg?.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          rows="4"
          placeholder="Type your reply here..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        ></textarea>

        <button
          onClick={handleReplySubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Send Reply
        </button>
      </div>

      <div className="mt-6">
        <h4 className="font-medium text-gray-700 mb-2">Change Ticket Status</h4>
        <button
          onClick={() => handleStatusChange('closed')}
          className={`bg-red-500 text-white px-4 py-2 rounded mr-2 ${status === 'closed' ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={status === 'closed'}
        >
          Close Ticket
        </button>
        <button
          onClick={() => handleStatusChange('open')}
          className={`bg-green-500 text-white px-4 py-2 rounded ${status === 'open' ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={status === 'open'}
        >
          Reopen Ticket
        </button>
      </div>
    </div>
  );
};

export default SingleTicket;
