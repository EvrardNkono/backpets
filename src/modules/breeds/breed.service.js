const Breed = require('./breed.model');

exports.createBreed = async (breedData) => {
    return await Breed.create(breedData);
};

exports.getAllBreeds = async () => {
    return await Breed.find().sort({ title: 1 }); // Tri alphabétique
};

exports.getBreedById = async (id) => {
    return await Breed.findById(id);
};

exports.getBreedByTitle = async (title) => {
    return await Breed.findOne({ title: title });
};

exports.updateBreed = async (id, updateData) => {
    return await Breed.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });
};

exports.deleteBreed = async (id) => {
    return await Breed.findByIdAndDelete(id);
};