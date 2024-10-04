####Ticket System
##Overview
This ticket system allows users to log in as either Customers or Agents. Customers can create and manage their tickets, while Agents can view, respond to, and close tickets. This system aims to facilitate efficient communication and support between customers and agents.

##Features
User Roles
Customer:

Log in to create, view, and manage tickets.
Start new conversations related to tickets.
Track the status of existing tickets.
Agent:

Log in to view all tickets created by customers.
Open, respond to, and close tickets.
Manage conversations and provide assistance to customers.
Ticket Management
Creating a Ticket:

Customers can create a ticket from their dashboard.
Each ticket requires a subject and a detailed description.
Viewing Tickets:

Customers can view all their created tickets along with their current status.
Agents can view all tickets in the system and filter by status.
Replying to a Ticket:

Agents can respond to customer tickets, providing solutions or updates.
Customers receive notifications when their tickets are replied to.
Closing a Ticket:

Agents can close tickets once the issue has been resolved.
Customers can view the closed tickets for their records.
Conversation Feature
User Conversations:
Customers and Agents can engage in conversations related to each ticket.
All conversation threads are stored for future reference.
Getting Started
Prerequisites
Node.js and npm installed on your machine.
MongoDB or another database set up for storing tickets and user information.
Installation
Clone the repository:

bash
Copy code
git clone <repository-url>
Navigate to the project directory:

bash
Copy code
cd ticket-system
Install dependencies:

bash
Copy code
npm install
Set up your environment variables. Create a .env file in the root directory and include your database connection string and other required configurations.

Start the development server:

bash
Copy code
npm start
Usage
Navigate to the application in your web browser (usually http://localhost:3000).
Log in as a customer or agent using the provided credentials.
Follow the on-screen instructions to create, manage, or respond to tickets.
Technologies Used
React for the frontend.
Node.js and Express for the backend.
MongoDB for the database.
JWT for user authentication.
