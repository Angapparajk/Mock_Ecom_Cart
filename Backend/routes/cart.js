const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const Receipt = require('../models/Receipt');
const auth = require('../middleware/auth');

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.userId })
      .populate('items.productId');

    if (!cart) {
      cart = await Cart.create({
        userId: req.user.userId,
        items: [],
      });
    }

    // Remove any items whose referenced product was deleted (productId is null after populate)
    const originalLength = cart.items.length;
    cart.items = cart.items.filter(item => item.productId);
    if (cart.items.length !== originalLength) {
      // persist the cleaned cart
      await cart.save();
      // re-populate to ensure consistency
      cart = await Cart.findOne({ userId: req.user.userId }).populate('items.productId');
    }

    // Calculate total (guard against missing product data)
    const total = cart.items.reduce((sum, item) => {
      const price = item.productId && item.productId.price ? item.productId.price : 0;
      const qty = item.quantity || 0;
      return sum + price * qty;
    }, 0);

    res.json({ cart, total });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add item to cart
router.post('/', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      // Create new cart if it doesn't exist
      cart = new Cart({
        userId: req.user.userId,
        items: [{ productId, quantity }],
      });
    } else {
      // Update existing cart
      const itemIndex = cart.items.findIndex(item => 
        item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    
    // Populate product details
    cart = await cart.populate('items.productId');

    // Calculate total (guard against missing product data)
    const total = cart.items.reduce((sum, item) => {
      const price = item.productId && item.productId.price ? item.productId.price : 0;
      const qty = item.quantity || 0;
      return sum + price * qty;
    }, 0);

    res.json({ cart, total });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from cart
router.delete('/:productId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => 
      item.productId.toString() !== req.params.productId
    );

    await cart.save();

    // Populate product details
    await cart.populate('items.productId');

    // Calculate total (guard against missing product data)
    const total = cart.items.reduce((sum, item) => {
      const price = item.productId && item.productId.price ? item.productId.price : 0;
      const qty = item.quantity || 0;
      return sum + price * qty;
    }, 0);

    res.json({ cart, total });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove all items from cart
router.delete('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      // Create an empty cart if one doesn't exist
      cart = await Cart.create({
        userId: req.user.userId,
        items: []
      });
    } else {
      // Clear existing cart's items
      cart.items = [];
      await cart.save();
    }

    res.json({ cart: { ...cart.toObject(), items: [] }, total: 0 });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Checkout
router.post('/checkout', auth, async (req, res) => {
  try {
    const [cart, user] = await Promise.all([
      Cart.findOne({ userId: req.user.userId }).populate('items.productId'),
      User.findById(req.user.userId).select('name email -_id')
    ]);

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const validItems = cart.items.filter(item => item.productId && item.productId.price);

    if (validItems.length === 0) {
      return res.status(400).json({ message: 'No valid items in cart' });
    }

    const total = validItems.reduce((sum, item) => {
      return sum + (item.productId.price * item.quantity);
    }, 0);

    const orderId = Math.random().toString(36).substr(2, 9);
    const itemsSnapshot = validItems.map(item => {
      const product = item.productId;
      return {
        productId: product._id,
        title: product.title || '',
        price: product.price || 0,
        quantity: item.quantity || 0,
      };
    });

    const savedReceipt = await Receipt.create({
      orderId,
      userId: req.user.userId,
      items: itemsSnapshot,
      total,
      timestamp: new Date(),
    });

    cart.items = [];
    await cart.save();

    const response = {
      orderId: savedReceipt.orderId,
      user: user,
      items: savedReceipt.items,
      total: savedReceipt.total,
      timestamp: savedReceipt.timestamp,
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;