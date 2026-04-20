require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app'); 

const PORT = process.env.PORT || 5000;

mongoose.set('strictQuery', false);

// Optimisation de la connexion pour le Serverless
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    
    try {
        // Options recommandées pour éviter les timeouts en prod
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connecté');
    } catch (err) {
        console.error('❌ Erreur DB :', err.message);
        // Ne pas throw l'erreur ici pour éviter de crash l'instance Vercel inutilement
    }
};

// En local, on lance le serveur normalement
if (process.env.NODE_ENV !== 'production') {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Mode DEV : http://localhost:${PORT}`);
        });
    });
}

// En PROD (Vercel), on exporte une fonction qui assure la connexion
const handler = async (req, res) => {
    await connectDB();
    return app(req, res);
};

module.exports = handler;