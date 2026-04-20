require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app'); 

const PORT = process.env.PORT || 5000;

// Configuration de Mongoose
mongoose.set('strictQuery', false);

// Connexion à MongoDB Atlas
// Note : Sur Vercel, la connexion est établie à chaque invocation si elle n'existe pas.
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Atlas Connecté (Signature Pets)');
    } catch (err) {
        console.error('❌ Erreur de connexion à la DB :', err.message);
    }
};

// On n'appelle connectDB ici que pour le développement local
// Vercel gérera la connexion via le middleware ou à l'import
connectDB();

// --- MODIFICATION POUR VERCEL ---
// On ne lance app.listen QUE si on est en local
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Serveur démarré sur : http://localhost:${PORT}`);
    });
}

// CRUCIAL : Exporter l'application pour que Vercel puisse l'utiliser
module.exports = app;