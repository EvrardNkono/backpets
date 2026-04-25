const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import des routes
const puppyRoutes = require('./modules/puppies/puppy.routes');
const breedRoutes = require('./modules/breeds/breed.routes'); 
// --- 1. IMPORT DU MODULE CHAT ---
const chatRoutes = require('./routes/chat.routes'); 

const app = express();

// --- MIDDLEWARES DE SÉCURITÉ ET LOGS ---
app.use(helmet()); 
app.use(cors()); 
app.use(morgan('dev')); 
app.use(express.json()); // CRUCIAL pour recevoir les messages du chat

// --- ROUTES DE L'API ---
app.get('/', (req, res) => {
    res.json({ 
        message: "Bienvenue sur l'API de Signature Pets",
        status: "Opérationnel" 
    });
});

// Routes existantes
app.use('/api/v1/puppies', puppyRoutes);
app.use('/api/v1/breeds', breedRoutes); 

// --- 2. ROUTE POUR LE LIVE CHAT ---
app.use('/api/v1/chat', chatRoutes); 

// --- GESTIONNAIRE D'ERREURS ---
app.use((err, req, res, next) => {
    console.log("--- ❌ ERREUR SERVEUR DÉTECTÉE ---");
    console.error(err); 

    res.status(err.status || 500).json({
        success: false,
        message: "Erreur lors du traitement de la requête",
        error: err.message || "Erreur interne"
    });
});

module.exports = app;