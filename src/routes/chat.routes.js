const express = require('express');
const router = express.Router();
const ChatMessage = require('../modules/chat/ChatMessage'); 

// --- 1. ROUTE ADMIN (LISTER TOUTES LES CONVERSATIONS) ---
// Cette route doit impérativement être placée AVANT la route /messages/:senderId
router.get('/admin/conversations', async (req, res) => {
  try {
    const summary = await ChatMessage.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$senderId",
          lastMessage: { $first: "$text" },
          lastUpdate: { $first: "$timestamp" },
          puppy: { $first: "$puppyContext" },
          unreadCount: { 
            $sum: { $cond: [{ $eq: ["$isAdmin", false] }, 1, 0] } 
          }
        }
      },
      { $sort: { lastUpdate: -1 } }
    ]);
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- 2. ROUTE ENVOYER UN MESSAGE (POST) ---
router.post('/messages', async (req, res) => {
  try {
    const { senderId, text, puppyContext, isAdmin } = req.body;
    
    const newMessage = new ChatMessage({
      senderId,
      text,
      puppyContext,
      isAdmin: isAdmin || false
    });

    await newMessage.save();
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- 3. ROUTE RÉCUPÉRER L'HISTORIQUE (GET) ---
router.get('/messages/:senderId', async (req, res) => {
  try {
    const messages = await ChatMessage.find({ senderId: req.params.senderId })
                                     .sort({ timestamp: 1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;