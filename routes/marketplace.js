// routes/marketplace.js
const express = require('express');
const Event = require('../models/Event');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// Get all swappable slots excluding the logged-in user's own slots
router.get('/', authenticate, async (req, res) => {
  try {
    const swappableEvents = await Event.find({ 
      status: 'swappable', 
      userId: { $ne: req.user.userId }
    }).populate('userId', 'name email'); // optional: populate user info
    res.json(swappableEvents);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch marketplace slots' });
  }
});

module.exports = router;
