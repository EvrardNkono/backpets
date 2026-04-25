require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app'); 

const PORT = process.env.PORT || 5000;

// Configuration de Mongoose
mongoose.set('strictQuery', false);

// Connexion à MongoDB Atlas
// Optimisé pour le "Serverless" : on réutilise la connexion existante
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    
    try {
       // APRÈS (nettoyé)
await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Atlas Connecté (Signature Pets - Live Chat Ready)');
    } catch (err) {
        console.error('❌ Erreur de connexion à la DB :', err.message);
    }
};

// Initialisation de la connexion
connectDB();

// --- LOGIQUE VERCEL / LOCAL ---
// En production (Vercel), l'application est exportée comme une fonction.
// En local, on lance le serveur sur le port spécifié.
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Serveur Signature démarré sur : http://localhost:${PORT}`);
        console.log(`💬 Chat API disponible sur : http://localhost:${PORT}/api/v1/chat`);
    });
}

// CRUCIAL : Exporter l'application pour Vercel
module.exports = app;