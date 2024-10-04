const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();  
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;
  
    // Validate role
    if (!['customer', 'agent'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either customer or agent.' });
    }
    // Validate email (simple regex for example)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }
  
    // Check for existing user
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }
  
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword, role });
  
      // Save the new user
      await newUser.save();
      res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
      // Log the error for debugging
      console.error('Error creating user:', error);
  
      // Check for duplicate email error
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Email already registered.' });
      }
  
      // Handle other errors
      res.status(500).json({ message: 'Error creating user. Please try again later.' });
    }
  });

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, role: user.role, userId: user._id });
});




module.exports = router;
