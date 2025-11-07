const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      const User = require('./models/User');
      const bcrypt = require('bcryptjs');

      const demoUsers = [
        { name: 'Rahul', email: 'rahul@demo.com', password: 'rahul@2021' },
        { name: 'Raja', email: 'raja@demo.com', password: 'raja@2021' },
      ];

      for (const u of demoUsers) {
        const existing = await User.findOne({ email: u.email });
        if (!existing) {
          const salt = await bcrypt.genSalt(10);
          const hashed = await bcrypt.hash(u.password, salt);
          const newUser = new User({ name: u.name, email: u.email, password: hashed });
          await newUser.save();
        }
      }
    } catch (e) {
      // Silent demo user creation
    }
  })
  .catch(err => {});

// Import Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {});