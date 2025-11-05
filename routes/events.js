const express = require('express');
const Event = require('../models/Event');
const authenticate = require('../middleware/authMiddleware'); // JWT auth middleware

const router = express.Router();

// Get logged-in user's events
router.get('/', authenticate, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user.userId });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});

// Create a new event
router.post('/', authenticate, async (req, res) => {
  const { title, startTime, endTime, status } = req.body;
  try {
    const event = new Event({ userId: req.user.userId, title, startTime, endTime, status });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error("Event creation error:", error.message);
    res.status(500).json({ message: 'Failed to create event' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch event' });
  }
});

// Update event status or details
router.put('/:id', authenticate, async (req, res) => {
  const eventId = req.params.id;
  try {
    const event = await Event.findOneAndUpdate(
      { _id: eventId, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update event' });
  }
});

// Delete Event by ID
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete event' });
  }
});


module.exports = router;
