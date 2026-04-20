const Puppy = require('./puppy.model');

/**
 * Créer un nouveau chiot
 */
exports.createPuppy = async (puppyData) => {
    return await Puppy.create(puppyData);
};

/**
 * Récupérer tous les chiots (avec filtres optionnels)
 */
exports.getAllPuppies = async () => {
    return await Puppy.find().sort({ createdAt: -1 }); // Du plus récent au plus ancien
};

/**
 * Récupérer un chiot par son ID
 */
exports.getPuppyById = async (id) => {
    return await Puppy.findById(id);
};

/**
 * Mettre à jour les informations d'un chiot
 */
exports.updatePuppy = async (id, updateData) => {
    return await Puppy.findByIdAndUpdate(id, updateData, {
        new: true,         // Retourne le document modifié
        runValidators: true // Force la vérification du Schéma (prix, nom, etc.)
    });
};

/**
 * Supprimer un chiot
 */
exports.deletePuppy = async (id) => {
    return await Puppy.findByIdAndDelete(id);
};