const puppyService = require('./puppy.service');

// @desc    Créer un nouveau chiot
// @route   POST /api/v1/puppies
exports.createPuppy = async (req, res) => {
    try {
        const imageUrls = req.files ? req.files.map(file => file.path) : [];

        const puppyData = {
            ...req.body,
            images: imageUrls
        };

        const newPuppy = await puppyService.createPuppy(puppyData);

        res.status(201).json({ 
            success: true, 
            message: "Chiot enregistré avec succès",
            data: newPuppy 
        });
    } catch (error) {
        console.error("Erreur de création :", error);
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Récupérer tous les chiots
// @route   GET /api/v1/puppies
exports.getPuppies = async (req, res) => {
    try {
        const puppies = await puppyService.getAllPuppies();
        res.status(200).json({ 
            success: true, 
            count: puppies.length, 
            data: puppies 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: "Erreur lors de la récupération" });
    }
};

// @desc    Récupérer un seul chiot
// @route   GET /api/v1/puppies/:id
exports.getPuppy = async (req, res) => {
    try {
        const puppy = await puppyService.getPuppyById(req.params.id);
        if (!puppy) {
            return res.status(404).json({ success: false, error: "Chiot non trouvé" });
        }
        res.status(200).json({ success: true, data: puppy });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Mettre à jour un chiot
// @route   PUT /api/v1/puppies/:id
exports.updatePuppy = async (req, res) => {
    try {
        let updateData = { ...req.body };

        // Si de nouvelles images sont téléchargées via Multer/Cloudinary
        if (req.files && req.files.length > 0) {
            const imageUrls = req.files.map(file => file.path);
            updateData.images = imageUrls;
        }

        const updatedPuppy = await puppyService.updatePuppy(req.params.id, updateData);

        if (!updatedPuppy) {
            return res.status(404).json({ success: false, error: "Chiot non trouvé" });
        }

        res.status(200).json({ 
            success: true, 
            message: "Mise à jour réussie",
            data: updatedPuppy 
        });
    } catch (error) {
        console.error("Erreur de mise à jour :", error);
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Supprimer un chiot
// @route   DELETE /api/v1/puppies/:id
exports.deletePuppy = async (req, res) => {
    try {
        const puppy = await puppyService.deletePuppy(req.params.id);
        
        if (!puppy) {
            return res.status(404).json({ success: false, error: "Chiot non trouvé" });
        }

        res.status(200).json({ 
            success: true, 
            message: "Chiot supprimé avec succès",
            data: {} 
        });
    } catch (error) {
        console.error("Erreur de suppression :", error);
        res.status(400).json({ success: false, error: error.message });
    }
};

// ========== NOUVELLES FONCTIONS POUR LE CAROUSEL ==========

// @desc    Ajouter des images à un chiot existant (sans remplacer les existantes)
// @route   POST /api/v1/puppies/:id/images/add
exports.addPuppyImages = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Vérifier si des fichiers ont été uploadés
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: "Aucune image téléchargée" 
            });
        }

        // Récupérer les URLs des nouvelles images
        const newImageUrls = req.files.map(file => file.path);
        
        // Récupérer le chiot existant
        const puppy = await puppyService.getPuppyById(id);
        if (!puppy) {
            return res.status(404).json({ 
                success: false, 
                error: "Chiot non trouvé" 
            });
        }

        // Fusionner les images existantes avec les nouvelles
        const updatedImages = [...puppy.images, ...newImageUrls];
        
        // Mettre à jour le chiot
        const updatedPuppy = await puppyService.updatePuppy(id, { 
            images: updatedImages 
        });

        res.status(200).json({
            success: true,
            message: `${newImageUrls.length} image(s) ajoutée(s) avec succès`,
            data: {
                puppy: updatedPuppy,
                addedImages: newImageUrls,
                totalImages: updatedImages.length
            }
        });
    } catch (error) {
        console.error("Erreur lors de l'ajout d'images :", error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

// @desc    Remplacer toutes les images d'un chiot
// @route   PUT /api/v1/puppies/:id/images/replace
exports.replacePuppyImages = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Vérifier si des fichiers ont été uploadés
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: "Aucune image téléchargée" 
            });
        }

        // Récupérer les URLs des nouvelles images
        const newImageUrls = req.files.map(file => file.path);
        
        // Remplacer complètement les images
        const updatedPuppy = await puppyService.updatePuppy(id, { 
            images: newImageUrls 
        });

        if (!updatedPuppy) {
            return res.status(404).json({ 
                success: false, 
                error: "Chiot non trouvé" 
            });
        }

        res.status(200).json({
            success: true,
            message: `${newImageUrls.length} image(s) mises à jour avec succès`,
            data: {
                puppy: updatedPuppy,
                images: newImageUrls,
                totalImages: newImageUrls.length
            }
        });
    } catch (error) {
        console.error("Erreur lors du remplacement des images :", error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

// @desc    Supprimer une image spécifique d'un chiot
// @route   DELETE /api/v1/puppies/:id/images
exports.removePuppyImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { imageUrl } = req.body; // URL de l'image à supprimer
        
        if (!imageUrl) {
            return res.status(400).json({ 
                success: false, 
                error: "URL de l'image à supprimer requise" 
            });
        }

        // Récupérer le chiot
        const puppy = await puppyService.getPuppyById(id);
        if (!puppy) {
            return res.status(404).json({ 
                success: false, 
                error: "Chiot non trouvé" 
            });
        }

        // Filtrer pour supprimer l'image spécifique
        const updatedImages = puppy.images.filter(img => img !== imageUrl);
        
        // Mettre à jour le chiot
        const updatedPuppy = await puppyService.updatePuppy(id, { 
            images: updatedImages 
        });

        res.status(200).json({
            success: true,
            message: "Image supprimée avec succès",
            data: {
                puppy: updatedPuppy,
                removedImage: imageUrl,
                remainingImages: updatedImages.length
            }
        });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'image :", error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

// @desc    Réordonner les images d'un chiot
// @route   PUT /api/v1/puppies/:id/images/reorder
exports.reorderPuppyImages = async (req, res) => {
    try {
        const { id } = req.params;
        const { imageOrder } = req.body; // Tableau des URLs dans le nouvel ordre
        
        if (!imageOrder || !Array.isArray(imageOrder)) {
            return res.status(400).json({ 
                success: false, 
                error: "L'ordre des images doit être un tableau valide" 
            });
        }

        // Récupérer le chiot
        const puppy = await puppyService.getPuppyById(id);
        if (!puppy) {
            return res.status(404).json({ 
                success: false, 
                error: "Chiot non trouvé" 
            });
        }

        // Vérifier que toutes les images existent
        const allImagesExist = imageOrder.every(url => puppy.images.includes(url));
        if (!allImagesExist || imageOrder.length !== puppy.images.length) {
            return res.status(400).json({ 
                success: false, 
                error: "L'ordre des images ne correspond pas aux images existantes" 
            });
        }

        // Mettre à jour avec le nouvel ordre
        const updatedPuppy = await puppyService.updatePuppy(id, { 
            images: imageOrder 
        });

        res.status(200).json({
            success: true,
            message: "Ordre des images mis à jour",
            data: updatedPuppy
        });
    } catch (error) {
        console.error("Erreur lors du réordonnancement des images :", error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};