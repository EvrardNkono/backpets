const express = require('express');
const router = express.Router();
const { upload, uploadFields } = require('../../middlewares/upload'); // 👈 IMPORT CORRIGÉ
const { 
    createPuppy, 
    getPuppies, 
    getPuppy, 
    updatePuppy, 
    deletePuppy,
    addPuppyImages,
    replacePuppyImages,
    removePuppyImage,
    reorderPuppyImages
} = require('./puppy.controller');

// Routes CRUD de base - Utiliser uploadFields pour accepter les champs multiples
router.route('/')
    .get(getPuppies)
    .post(uploadFields, createPuppy);  // 👈 Utilise uploadFields

router.route('/:id')
    .get(getPuppy)
    .put(uploadFields, updatePuppy)    // 👈 Utilise uploadFields
    .delete(deletePuppy);

// ========== ROUTES POUR LE CAROUSEL ==========
// Ces routes utilisent upload.array car elles n'acceptent qu'un seul champ 'images'
router.post('/:id/images/add', upload.array('images', 10), addPuppyImages);
router.put('/:id/images/replace', upload.array('images', 10), replacePuppyImages);
router.delete('/:id/images', removePuppyImage);
router.put('/:id/images/reorder', reorderPuppyImages);

module.exports = router;