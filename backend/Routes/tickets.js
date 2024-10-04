const express = require('express');
const Ticket = require('../models/Ticket');
const authMiddleware = require('../middleware/auth'); // Import the auth middleware
const authenticateJWT = require('../middleware/ticket');
const router = express.Router();
require('dotenv').config();  

// Create Ticket (For customers to create tickets)
router.post('/create', async (req, res) => {
    const { customerName, email, issue, description, assignedTo, createdBy } = req.body;
    
    // Validate required fields
    if (!customerName || !email || !issue || !description) {
      return res.status(400).json({ message: 'All fields except assignedTo are required.' });
    }
  
    try {

      
      const ticket = new Ticket({
        ticketId: `TICKET-${Date.now()}`,
        customerName,
        email,
        issue,
        description,
        assignedTo,
        createdBy  // Automatically set the user ID
      });
  
      await ticket.save();
      res.status(201).json(ticket);
    } catch (error) {
      console.error('Error creating ticket:', error);
      res.status(500).json({ message: 'Error creating ticket', error: error.message });
    }
  });
  
  

// Get all tickets (With pagination and search functionality)
router.get('/my-tickets', async (req, res) => {
  const { page = 1, limit = 10, search, userId } = req.query; // Get userId from query

  // Add the userId to the query to only find tickets created by the logged-in user
  const query = {
    createdBy: userId,  // Match tickets created by the specific user
    ...(search && { $or: [{ customerName: new RegExp(search, 'i') }, { issue: new RegExp(search, 'i') }] }),
  };

  try {
    const tickets = await Ticket.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await Ticket.countDocuments(query);

    res.json({
      tickets,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tickets' });
  }
});

// Controller to get tickets by user ID
router.get("/allTickets", async (req, res) => {
  const page = parseInt(req.query.page) || 1;  // Default page is 1
  const limit = parseInt(req.query.limit) || 10;  // Default limit is 10 tickets per page

  try {
      const totalTickets = await Ticket.countDocuments();  // Get the total number of tickets
      const tickets = await Ticket.find()
          .skip((page - 1) * limit)  // Skip the tickets of previous pages
          .limit(limit);  // Limit the results to the given limit

      if (!tickets.length) {
          return res.status(404).json({ message: 'No tickets found.' });
      }

      res.status(200).json({
          totalTickets,
          totalPages: Math.ceil(totalTickets / limit),
          currentPage: page,
          tickets
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while fetching tickets.' });
  }
});

// Get a single ticket by ID
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving ticket' });
  }
});

// Assign a ticket to an agent (for admin/agents)
router.put('/tickets/:id/assign', async (req, res) => {
  const { assignedAgent } = req.body;
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, { assignedAgent }, { new: true });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error assigning agent' });
  }
});


// Reply to ticket (both customers and agents can reply)
router.patch('/:ticketId/reply', async (req, res) => {
  const { ticketId } = req.params;  // Extract the custom ticketId from params
  const { sender, message, date } = req.body;  // Get sender, message, and date from the request body

  try {
    // Find the ticket by custom field 'ticketId' instead of _id
    const ticket = await Ticket.findOneAndUpdate(
      { ticketId: ticketId },  // Search by ticketId field
      { 
        $push: { 
          communication: { sender, content: message, timestamp: date || Date.now() } 
        }  // Add the new message to communication (renamed from conversation)
      },
      { new: true }  // Return the updated document
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json(ticket);  // Send the updated ticket back
  } catch (error) {
    res.status(500).json({ message: 'Error updating ticket', error: error.message });
  }
});




// Close ticket (Only agents should be able to close the ticket)
// Close or change the status of a ticket (Only agents can change the status)
router.patch('/:ticketId/status', async (req, res) => {
  const { status,role } = req.body;  // Extract the new status from the request body
  const {ticketId} = req.params;
  const _id = ticketId
  // Check if the user is an agent
  if (role !== 'agent') {
    return res.status(403).json({ message: 'Only agents can change ticket status' });
  }

  try {
    // Find the ticket by ticketId and update the status
    const ticket = await Ticket.findOneAndUpdate(
      { _id },  // Search by the ticketId field
      { status: status },  // Update the status to the new value provided
      { new: true }  // Return the updated document
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json(ticket);  // Return the updated ticket
  } catch (error) {
    res.status(500).json({ message: 'Error updating ticket status', error: error.message });
  }
});




// Add a message to the conversation (for both customer and agent)
router.post('/:id/message', async (req, res) => {
  const { content } = req.body;
  const sender = req.user.role === 'agent' ? 'agent' : 'customer'; // Determine sender role

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Push the new message into the conversation array
    ticket.conversation.push({ sender, content, timestamp: Date.now() });
    await ticket.save();

    res.status(201).json({ message: 'Message added', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Error adding message' });
  }
});

module.exports = router;
