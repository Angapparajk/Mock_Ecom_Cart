const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get all products
router.get('/', async (req, res) => {
  try {
    const { sort_by, title_search, rating, category } = req.query;
    
    const filter = {};
    
    // Title search: match words in any order
    if (title_search) {
      const searchWords = title_search.trim().split(/\s+/).filter(word => word.length > 0);
      if (searchWords.length > 0) {
        filter.$and = searchWords.map(word => ({
          $or: [
            { title: { $regex: word, $options: 'i' } },
            { brand: { $regex: word, $options: 'i' } }
          ]
        }));
      }
    }

    // Rating filter: convert to number and use gte
    if (rating) {
      const minRating = parseFloat(rating);
      if (!Number.isNaN(minRating)) {
        filter.rating = { $gte: minRating };
      }
    }

    // Category filter: match exact category name from enum
    if (category) {
      const categoryMap = {
        '1': 'Clothing',
        '2': 'Electronics',
        '3': 'Appliances',
        '4': 'Grocery',
        '5': 'Toys'
      };
      const categoryName = categoryMap[category];
      if (categoryName) {
        filter.category = categoryName;
      }
    }

    let query = Product.find(filter);

    if (sort_by === 'PRICE_HIGH') {
      query = query.sort({ price: -1 });
    } else if (sort_by === 'PRICE_LOW') {
      query = query.sort({ price: 1 });
    }

    const products = await query.exec();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    // If invalid ObjectId, return 404
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;