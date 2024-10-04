const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  issue: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
  communication: [
    {
      sender: { type: String, enum: ["customer", "agent"], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // New field for the creator
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ticket", ticketSchema);
