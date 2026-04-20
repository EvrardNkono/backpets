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