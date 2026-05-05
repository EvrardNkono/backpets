const puppyService = require('./puppy.service');

// @desc    Créer un nouveau chiot
// @route   POST /api/v1/puppies
exports.createPuppy = async (req, res) => {
    try {
        // ✅ Gérer les champs multiples
        let allImages = [];
        
        // Récupérer les images du champ 'images'
        if (req.files && req.files['images']) {
            const urls = req.files['images'].map(file => file.path);
            allImages.push(...urls);
        }
        
        // Récupérer l'image principale du champ 'mainImage'
        if (req.files && req.files['mainImage']) {
            const urls = req.files['mainImage'].map(file => file.path);
            allImages.push(...urls);
        }
        
        // Récupérer les images de galerie du champ 'galleryImages'
        if (req.files && req.files['galleryImages']) {
            const urls = req.files['galleryImages'].map(file => file.path);
            allImages.push(...urls);
        }
        
        // Conserver les images existantes (si c'est une édition avec existingImages)
        if (req.body.existingImages) {
            try {
                const existing = JSON.parse(req.body.existingImages);
                allImages = [...existing, ...allImages];
            } catch(e) {
                console.log('Error parsing existingImages:', e);
            }
        }
        
        const puppyData = {
            ...req.body,
            images: allImages
        };
        
        // Nettoyer les champs temporaires
        delete puppyData.existingImages;
        delete puppyData.mainImageFile;
        delete puppyData.galleryFiles;
        delete puppyData.mainImage;
        delete puppyData.galleryImages;

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
        
        // ✅ Gérer les champs multiples pour la mise à jour
        let allImages = [];
        
        // 1. Récupérer les images existantes (envoyées en JSON depuis le frontend)
        if (req.body.existingImages) {
            try {
                const existing = JSON.parse(req.body.existingImages);
                allImages.push(...existing);
            } catch(e) {
                console.log('Error parsing existingImages:', e);
            }
        }
        
        // 2. Récupérer les nouvelles images du champ 'images'
        if (req.files && req.files['images']) {
            const urls = req.files['images'].map(file => file.path);
            allImages.push(...urls);
        }
        
        // 3. Récupérer l'image principale du champ 'mainImage'
        if (req.files && req.files['mainImage']) {
            const urls = req.files['mainImage'].map(file => file.path);
            allImages.push(...urls);
        }
        
        // 4. Récupérer les images de galerie du champ 'galleryImages'
        if (req.files && req.files['galleryImages']) {
            const urls = req.files['galleryImages'].map(file => file.path);
            allImages.push(...urls);
        }
        
        // 5. Mettre à jour le champ images si de nouvelles images arrivent
        if (allImages.length > 0) {
            updateData.images = allImages;
        }
        
        // Nettoyer les champs temporaires
        delete updateData.existingImages;
        delete updateData.mainImageFile;
        delete updateData.galleryFiles;
        delete updateData.mainImage;
        delete updateData.galleryImages;

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

// ========== FONCTIONS POUR LE CAROUSEL ==========

// @desc    Ajouter des images à un chiot existant
// @route   POST /api/v1/puppies/:id/images/add
exports.addPuppyImages = async (req, res) => {
    try {
        const { id } = req.params;
        
        // ✅ Vérifier les fichiers dans le champ 'images' (upload.array)
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: "Aucune image téléchargée" 
            });
        }

        const newImageUrls = req.files.map(file => file.path);
        
        const puppy = await puppyService.getPuppyById(id);
        if (!puppy) {
            return res.status(404).json({ 
                success: false, 
                error: "Chiot non trouvé" 
            });
        }

        const updatedImages = [...puppy.images, ...newImageUrls];
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
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: "Aucune image téléchargée" 
            });
        }

        const newImageUrls = req.files.map(file => file.path);
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
        const { imageUrl } = req.body;
        
        if (!imageUrl) {
            return res.status(400).json({ 
                success: false, 
                error: "URL de l'image à supprimer requise" 
            });
        }

        const puppy = await puppyService.getPuppyById(id);
        if (!puppy) {
            return res.status(404).json({ 
                success: false, 
                error: "Chiot non trouvé" 
            });
        }

        const updatedImages = puppy.images.filter(img => img !== imageUrl);
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
        const { imageOrder } = req.body;
        
        if (!imageOrder || !Array.isArray(imageOrder)) {
            return res.status(400).json({ 
                success: false, 
                error: "L'ordre des images doit être un tableau valide" 
            });
        }

        const puppy = await puppyService.getPuppyById(id);
        if (!puppy) {
            return res.status(404).json({ 
                success: false, 
                error: "Chiot non trouvé" 
            });
        }

        const allImagesExist = imageOrder.every(url => puppy.images.includes(url));
        if (!allImagesExist || imageOrder.length !== puppy.images.length) {
            return res.status(400).json({ 
                success: false, 
                error: "L'ordre des images ne correspond pas aux images existantes" 
            });
        }

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