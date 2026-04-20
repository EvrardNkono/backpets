const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload'); 
// Ajoute updatePuppy et deletePuppy ici
const { createPuppy, getPuppies, getPuppy, updatePuppy, deletePuppy } = require('./puppy.controller');

router.route('/')
    .get(getPuppies)
    .post(upload.array('images', 5), createPuppy); 

router.route('/:id')
    .get(getPuppy)
    .put(upload.array('images', 5), updatePuppy) // Route pour la modification
    .delete(deletePuppy);                        // Route pour la suppression

module.exports = router;