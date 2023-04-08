const mongoose = require('mongoose');

// create schema for a payment document
const paymentSchema = new mongoose.Schema({
  sale: { type: String},
  species: { type: String, required: 'Species type is required' },
  age: { type: Number },
  color: { type: String },
  sterilized: { type: Boolean },
  comments: { type: String },
});

module.exports = mongoose.model('Payment', paymentSchema);
