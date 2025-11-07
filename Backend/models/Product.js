const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Clothing', 'Electronics', 'Appliances', 'Grocery', 'Toys']
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);