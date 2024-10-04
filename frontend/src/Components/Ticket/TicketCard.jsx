import React from 'react';
import { Clock, Mail, MessageSquare, User } from 'lucide-react';

const TicketCard = ({ ticket }) => {
  const statusColor = ticket.status === 'open' ? 'bg-green-500' : 'bg-red-500';

    console.log(ticket,"ticket")

  return (
    <div className="bg-blue-50 rounded-lg border border-blue-200 shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{ticket.issue}</h3>
        <span className={`${statusColor} text-white text-sm font-medium px-2 py-1 rounded-full`}>
          {ticket.status}
        </span>
      </div>
      <div className="space-y-2">
        <p className="flex items-center text-gray-600">
          <User className="w-4 h-4 mr-2" />
          <span className="font-medium mr-2">Customer:</span> {ticket.customerName}
        </p>
        <p className="flex items-center text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          <span className="font-medium mr-2">Email:</span> {ticket.email}
        </p>
        <p className="flex items-center text-gray-600">
          <MessageSquare className="w-4 h-4 mr-2" />
          <span className="font-medium mr-2">Ticket ID:</span> {ticket.ticketId}
        </p>
        <p className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span className="font-medium mr-2">Created:</span> 
          {new Date(ticket.createdAt).toLocaleString()}
        </p>
      </div>
      <div className="mt-4">
        <h4 className="font-medium text-gray-700 mb-2">Description:</h4>
        <p className="text-gray-600">{ticket.description}</p>
      </div>
    </div>
  );
};

export default TicketCard;