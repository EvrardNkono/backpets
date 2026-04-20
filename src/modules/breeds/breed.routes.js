const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload'); // Vérifie bien le chemin vers ton middleware upload
const { 
    createBreed, 
    getBreeds, 
    updateBreed, 
    deleteBreed 
} = require('./breed.controller');

router.route('/')
    .get(getBreeds)
    .post(upload.single('heroImage'), createBreed); // On attend un champ nommé 'heroImage'

router.route('/:id')
    .put(upload.single('heroImage'), updateBreed)
    .delete(deleteBreed);

module.exports = router;