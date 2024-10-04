import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TicketCard from './TicketCard';  // Import the TicketCard component

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTickets(currentPage, search);
  }, [currentPage, search]);

  const fetchTickets = async (page, searchQuery) => {
    try {
      const userId = localStorage.getItem('userId');  // Get userId from localStorage

      const response = await axios.get('http://localhost:5000/api/ticket/my-tickets', {
        params: {
          page,
          limit: 10,  // Adjust limit as needed
          search: searchQuery,
          userId,      // Pass userId as a parameter
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,  // Assuming token is stored in localStorage
        },
      });

      setTickets(response?.data?.tickets || []);  // Optional chaining to ensure safe access
      setTotalPages(response?.data?.totalPages || 1);
      setLoading(false);  // Stop loading when data is fetched
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setLoading(false);  // Stop loading even if there is an error
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div>
      <h1>My Tickets</h1>
      
      <input
        type="text"
        placeholder="Search tickets..."
        value={search}
        onChange={handleSearchChange}
      />
      
      {loading ? (
        <p>Loading tickets...</p>
      ) : (
        <div className="tickets-list">
          {tickets.length > 0 ? (
            tickets.map(ticket => (
              <TicketCard key={ticket?._id} ticket={ticket} />  // Use TicketCard for each ticket
            ))
          ) : (
            <p>No tickets found.</p>
          )}
        </div>
      )}

      <div className="pagination-controls">
        <button 
          disabled={currentPage === 1} 
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button 
          disabled={currentPage === totalPages} 
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MyTickets;
