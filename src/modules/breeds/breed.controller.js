const breedService = require('./breed.service');

// @desc    Créer une nouvelle race
// @route   POST /api/v1/breeds
exports.createBreed = async (req, res) => {
    try {
        // On récupère l'image unique via upload.single('heroImage')
        const imageUrl = req.file ? req.file.path : null;

        const breedData = {
            ...req.body,
            heroImage: imageUrl
        };

        const newBreed = await breedService.createBreed(breedData);

        res.status(201).json({ 
            success: true, 
            data: newBreed 
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Récupérer toutes les races
exports.getBreeds = async (req, res) => {
    try {
        const breeds = await breedService.getAllBreeds();
        res.status(200).json({ success: true, data: breeds });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Mettre à jour une race
exports.updateBreed = async (req, res) => {
    try {
        let updateData = { ...req.body };
        
        // Si une nouvelle image est téléchargée
        if (req.file) {
            updateData.heroImage = req.file.path;
        }

        const updatedBreed = await breedService.updateBreed(req.params.id, updateData);
        
        if (!updatedBreed) {
            return res.status(404).json({ success: false, error: "Race non trouvée" });
        }

        res.status(200).json({ success: true, data: updatedBreed });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Supprimer une race
exports.deleteBreed = async (req, res) => {
    try {
        const deleted = await breedService.deleteBreed(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, error: "Race non trouvée" });
        }
        res.status(200).json({ success: true, message: "Race supprimée avec succès" });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};