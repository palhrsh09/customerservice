import React, { useEffect, useState } from "react";
import axios from "axios";
import TicketCard from "./TicketCard"; // Make sure to import the TicketCard component
import { useNavigate } from "react-router-dom";

export const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Add page state
  const [totalPages, setTotalPages] = useState(1); // Add totalPages state
  const [limit] = useState(10); // Limit the number of tickets per page (you can adjust this)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/ticket/allTickets`, {
          params: { page, limit },
        });
        setTickets(response.data.tickets); // Assuming the API returns a paginated response
        setTotalPages(response.data.totalPages); // Set total pages from API response
      } catch (err) {
        setError("Error fetching tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [page, limit]); // Re-fetch tickets when the page or limit changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 text-xl mt-10">{error}</div>
    );
  }

  const handleClick = (ticket) => {
    navigate(`/tickets/${ticket._id}`, { state: { ticket } });
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1); // Move to the previous page
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1); // Move to the next page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">All Tickets</h2>

      {tickets.length === 0 ? (
        <div className="text-center text-gray-600 text-xl">
          No tickets available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets?.map((ticket) => (
            <div
              key={ticket?._id}
              onClick={() => handleClick(ticket)}
              className="cursor-pointer"
            >
              <TicketCard ticket={ticket} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-8">
        <button
          className={`px-4 py-2 mx-2 ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
          disabled={page === 1}
          onClick={handlePreviousPage}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          className={`px-4 py-2 mx-2 ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
          disabled={page === totalPages}
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllTickets;