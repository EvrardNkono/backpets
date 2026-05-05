const express = require('express');
const router = express.Router();
const ChatMessage = require('../modules/chat/ChatMessage');
const axios = require('axios'); // Ajoutez cette ligne

// Configuration Pushover (à placer dans votre .env)
const PUSHOVER_API_TOKEN = process.env.PUSHOVER_API_TOKEN;
const PUSHOVER_USER_KEY = process.env.PUSHOVER_USER_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://backpets.vercel.app';

// --- FONCTION POUR ENVOYER UNE NOTIFICATION PUSHOVER ---
async function sendPushoverNotification(title, message, url = null) {
  if (!PUSHOVER_API_TOKEN || !PUSHOVER_USER_KEY) {
    console.log('⚠️ Pushover non configuré - Notifications désactivées');
    return false;
  }

  const data = {
    token: PUSHOVER_API_TOKEN,
    user: PUSHOVER_USER_KEY,
    title: title,
    message: message,
    sound: 'pushover',
    priority: 1,
    retry: 30,
    expire: 3600
  };

  if (url) {
    data.url = url;
    data.url_title = '📱 Répondre dans l\'admin';
  }

  try {
    await axios.post('https://api.pushover.net/1/messages.json', data);
    console.log('✅ Notification Pushover envoyée');
    return true;
  } catch (error) {
    console.error('❌ Erreur Pushover:', error.response?.data || error.message);
    return false;
  }
}

// --- 1. ROUTE ADMIN (LISTER TOUTES LES CONVERSATIONS) ---
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
    
    // 🔔 ENVOYER UNE NOTIFICATION PUSHOVER (sauf si c'est l'admin qui envoie)
    if (!isAdmin) {
      const clientId = senderId?.slice(-8) || 'Client';
      const puppyName = puppyContext?.name;
      
      const title = puppyName 
        ? `🐾 Demande d'adoption - ${puppyName}`
        : '💬 Nouveau message client';
      
      const messageBody = `${clientId}: ${text.slice(0, 100)}${text.length > 100 ? '...' : ''}`;
      
      // Envoyer la notification
      await sendPushoverNotification(title, messageBody, FRONTEND_URL);
    }
    
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error('Erreur:', error);
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

// --- 4. ROUTE POUR TESTER LES NOTIFICATIONS (OPTIONNEL) ---
router.post('/test-notification', async (req, res) => {
  try {
    const result = await sendPushoverNotification(
      '🔔 Test Notification',
      'Signature Pets - Les notifications fonctionnent correctement sur votre iPhone !',
      FRONTEND_URL
    );
    
    if (result) {
      res.json({ success: true, message: 'Notification de test envoyée !' });
    } else {
      res.status(500).json({ success: false, message: 'Erreur d\'envoi - Vérifiez votre configuration Pushover' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- 5. ROUTE POUR MARQUER LES MESSAGES COMME LUS (OPTIONNEL) ---
router.post('/mark-read/:senderId', async (req, res) => {
  try {
    const { senderId } = req.params;
    
    await ChatMessage.updateMany(
      { senderId: senderId, isAdmin: false },
      { isRead: true }
    );
    
    res.json({ success: true, message: 'Messages marqués comme lus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- 6. ROUTE POUR OBTENIR LE STATUT ---
router.get('/status', async (req, res) => {
  try {
    const unreadCount = await ChatMessage.countDocuments({ isAdmin: false, isRead: false });
    const lastUnread = await ChatMessage.findOne({ isAdmin: false, isRead: false })
      .sort({ timestamp: -1 });
    
    res.json({
      success: true,
      unreadCount: unreadCount,
      lastMessage: lastUnread ? {
        text: lastUnread.text?.slice(0, 50),
        senderId: lastUnread.senderId?.slice(-8),
        timestamp: lastUnread.timestamp
      } : null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;