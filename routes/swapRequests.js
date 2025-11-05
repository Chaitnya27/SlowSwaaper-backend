const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const SwapRequest = require('../models/SwapRequest');
const Event = require('../models/Event');

const router = express.Router();

// Create a new swap request
router.post('/', authenticate, async (req, res) => {
  const { eventId, toUserId } = req.body;
  try {
    const fromUserId = req.user.userId;

    // Prevent sending swap request to self or for non-swappable slots
    const event = await Event.findById(eventId);
    if (!event || event.userId.toString() === fromUserId) {
      return res.status(400).json({ message: 'Invalid swap request' });
    }
    if (event.status !== 'swappable') {
      return res.status(400).json({ message: 'Event is not swappable' });
    }

    const existingRequest = await SwapRequest.findOne({ fromUserId, eventId, status: 'pending' });
    if (existingRequest) {
      return res.status(400).json({ message: 'You already sent a pending request for this event' });
    }

    const swapRequest = new SwapRequest({ fromUserId, toUserId, eventId });
    await swapRequest.save();

    res.status(201).json(swapRequest);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create swap request' });
  }
});

// Get incoming swap requests for logged-in user
router.get('/incoming', authenticate, async (req, res) => {
  try {
    const requests = await SwapRequest.find({ toUserId: req.user.userId, status: 'pending' })
      .populate('fromUserId', 'name email')
      .populate('eventId');
    res.json(requests);
  } catch {
    res.status(500).json({ message: 'Failed to fetch incoming requests' });
  }
});

// Get outgoing swap requests sent by logged-in user
router.get('/outgoing', authenticate, async (req, res) => {
  try {
    const requests = await SwapRequest.find({ fromUserId: req.user.userId })
      .populate('toUserId', 'name email')
      .populate('eventId');
    res.json(requests);
  } catch {
    res.status(500).json({ message: 'Failed to fetch outgoing requests' });
  }
});

// Accept or reject a swap request
router.put('/:id', authenticate, async (req, res) => {
  const { status } = req.body; // 'accepted' or 'rejected'
  try {
    const swapRequest = await SwapRequest.findOne({ _id: req.params.id, toUserId: req.user.userId });
    if (!swapRequest) return res.status(404).json({ message: 'Swap request not found' });

    swapRequest.status = status;
    await swapRequest.save();

    if (status === 'accepted') {
    
      const event = await Event.findById(swapRequest.eventId);
      if (event) {
        event.status = 'busy';
        await event.save();
      }
    }

    res.json(swapRequest);
  } catch {
    res.status(500).json({ message: 'Failed to update swap request' });
  }
});

module.exports = router;
