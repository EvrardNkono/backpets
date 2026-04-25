const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  senderId: { 
    type: String, 
    required: true, 
    index: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  isAdmin: { 
    type: Boolean, 
    default: false 
  },
  puppyContext: {
    name: String,
    image: String
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);