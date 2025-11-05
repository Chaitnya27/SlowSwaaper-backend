const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
 
  
  try {
    // 1️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log("✅ User found:", user.email);

    // 2️⃣ Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    

    if (!isPasswordValid) {
      
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3️⃣ Generate token
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    
    res.json({ token });

  } catch (error) {
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;
