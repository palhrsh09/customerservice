import React, { useState } from 'react';
import { CreateTicket } from './Ticket/CreateTicket';
import MyTickets from './Ticket/MyTickets';
import { AllTickets } from './Ticket/AllTickets';
// import AgentTickets from './Ticket/AgentTickets';  // Assuming this is a component for agents to manage tickets

export const Dashboard = ({ user }) => {
  // State to manage visibility of CreateTicket component
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);

  // Function to toggle the visibility of CreateTicket
  const toggleCreateTicket = () => {
    setIsCreatingTicket(prevState => !prevState);
  };
  console.log(user,"user")

  return (
    <div className='px-10 py-10'>
   

      {/* Conditional rendering based on user role */}
      {user === 'customer' && (
        <div>
          <button 
            onClick={toggleCreateTicket} 
            className='bg-blue-500 text-white px-4 py-2 rounded'
          >
            {isCreatingTicket ? 'Cancel' : 'Create Ticket'}
          </button>
          
          {/* Conditionally render the CreateTicket component */}
          {isCreatingTicket && <CreateTicket />}
          
          {/* Show the user's created tickets */}
          <MyTickets />
        </div>
      )}

      {user === 'agent' && (
        <div>
          <h2>Agent Dashboard</h2>
          {/* Show agent-specific ticket management */}
          {/* <AgentTickets /> Assuming you have a component to manage agent tickets */}
          <AllTickets />
        </div>
      )}
    </div>
  );
};
