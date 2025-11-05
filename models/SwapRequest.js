const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  fromUserId: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User', 
     required: true 
    },
  toUserId: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
       required: true },
  eventId: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'Event',
      required: true },
  status: { 
    type: String,
     enum: ['pending', 'accepted', 'rejected'], 
     default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
