const mongoose = require('mongoose');

const puppySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Le nom du chiot est obligatoire"],
        trim: true
    },
    breed: {
        type: String,
        required: [true, "La race est obligatoire"],
        trim: true
    },
    age: {
        type: String,
        required: [true, "L'âge est obligatoire"],
        default: "8 weeks"
    },
    // Dans votre modèle puppy.model.js
gender: {
    type: String,
    enum: ['Male', 'Female', 'Mâle', 'Femelle'], // Accepte les deux
    required: [true, "Le genre est obligatoire"]
},
    color: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Le prix est obligatoire"]
    },
    status: {
        type: String,
        enum: ['Available', 'Reserved', 'Sold'],
        default: 'Available'
    },
    description: {
        type: String,
        trim: true
    },
    pedigree: {
        type: String,
        trim: true
    },
    images: {
        type: [String], // Tableau d'URLs renvoyées par Cloudinary
        default: []
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

module.exports = mongoose.model('Puppy', puppySchema);