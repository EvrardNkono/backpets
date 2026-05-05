// Installez d'abord axios
// npm install axios

// services/pushover.service.js
const axios = require('axios');

class PushoverService {
  constructor() {
    // Créez un compte gratuit sur https://pushover.net pour obtenir un API Token
    this.apiToken = process.env.PUSHOVER_API_TOKEN; // Votre token développeur
    this.userKey = process.env.PUSHOVER_USER_KEY;   // Le code du propriétaire
  }

  async sendNotification(title, message, url = null) {
    if (!this.apiToken || !this.userKey) {
      console.log('⚠️ Pushover non configuré');
      return;
    }

    const data = {
      token: this.apiToken,
      user: this.userKey,
      title: title,
      message: message,
      sound: 'pushover',  // Son par défaut
      priority: 1,        // Priorité haute
    };

    if (url) {
      data.url = url;
      data.url_title = '📱 Répondre dans l\'admin';
    }

    try {
      await axios.post('https://api.pushover.net/1/messages.json', data);
      console.log('✅ Notification Pushover envoyée');
    } catch (error) {
      console.error('❌ Erreur Pushover:', error.message);
    }
  }

  async notifyNewMessage(message, puppyName = null) {
    const clientId = message.senderId?.slice(-8) || 'Client';
    const title = puppyName 
      ? `🐾 Demande d'adoption - ${puppyName}`
      : '💬 Nouveau message client';
    
    const body = `${clientId}: ${message.text?.slice(0, 100)}`;
    
    return this.sendNotification(title, body, process.env.FRONTEND_URL);
  }
}

module.exports = new PushoverService();