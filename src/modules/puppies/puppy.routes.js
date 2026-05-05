const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload'); 
const { 
    createPuppy, 
    getPuppies, 
    getPuppy, 
    updatePuppy, 
    deletePuppy,
    addPuppyImages,        // NOUVEAU
    replacePuppyImages,    // NOUVEAU
    removePuppyImage,      // NOUVEAU
    reorderPuppyImages     // NOUVEAU
} = require('./puppy.controller');

// Routes CRUD de base
router.route('/')
    .get(getPuppies)
    .post(upload.array('images', 5), createPuppy); 

router.route('/:id')
    .get(getPuppy)
    .put(upload.array('images', 5), updatePuppy)
    .delete(deletePuppy);

// ========== NOUVELLES ROUTES POUR LE CAROUSEL ==========

// Ajouter des images à un chiot existant (sans remplacer)
router.post('/:id/images/add', upload.array('images', 10), addPuppyImages);

// Remplacer TOUTES les images d'un chiot
router.put('/:id/images/replace', upload.array('images', 10), replacePuppyImages);

// Supprimer une image spécifique d'un chiot
router.delete('/:id/images', removePuppyImage);

// Réordonner les images d'un chiot
router.put('/:id/images/reorder', reorderPuppyImages);

module.exports = router;