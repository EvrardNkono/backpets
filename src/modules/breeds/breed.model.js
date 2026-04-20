const mongoose = require('mongoose');

const breedSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Le titre de la race est obligatoire"],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, "La description de la race est obligatoire"]
    },
    origin: {
        type: String,
        default: "International"
    },
    temperament: {
        type: String
    },
    heroImage: {
        type: String, // URL renvoyée par Cloudinary
        required: [true, "L'image de présentation (Hero) est obligatoire"]
    },
    coatCare: {
        type: String,
        default: "Premium Grooming"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Breed', breedSchema);