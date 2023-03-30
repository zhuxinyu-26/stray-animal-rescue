const mongoose = require('mongoose');

// create schema for an animal document
const animalSchema = new mongoose.Schema({
  name: { type: String, required: 'Name is required' },
  species: { type: String, required: 'Species type is required' },
  age: { type: Number },
  color: { type: String },
  sterilized: { type: Boolean },
  comments: { type: String },
});

module.exports = mongoose.model('Animal', animalSchema);
