require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app'); 

const PORT = process.env.PORT || 5000;

// Configuration de Mongoose pour éviter les avertissements de futures versions
mongoose.set('strictQuery', false);

// Connexion à MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas Connecté (Signature Pets)');
    
    // On lance le serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur : http://localhost:${PORT}`);
      console.log(`📡 En attente de requêtes...`);
    });
  })
  .catch((err) => {
    console.error('❌ Erreur de connexion à la DB :', err.message);
    console.log('👉 Vérifie ton mot de passe et ton accès réseau (0.0.0.0/0)');
  });

// On ne met pas de module.exports ici, car c'est le point d'entrée final.