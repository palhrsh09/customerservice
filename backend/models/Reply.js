const { default: mongoose } = require("mongoose");

const replySchema = new mongoose.Schema({
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
    sender: { type: String, enum: ['customer', 'agent'] },
    message: String,
    createdAt: { type: Date, default: Date.now },
  });

  module.exports = mongoose.Model("Reply",replySchema)