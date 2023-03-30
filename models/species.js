const mongoose = require('mongoose');

// create schema for an species document
const speciesSchema = new mongoose.Schema({
  species: { type: String, required: 'Species type is required' },
});

module.exports = mongoose.model('species', speciesSchema);
