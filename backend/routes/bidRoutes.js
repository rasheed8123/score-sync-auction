import express from 'express';
import Bid from '../models/Bid.js';

const router = express.Router();

// Place a new bid
router.post('/', async (req, res) => {
  try {
    const bid = new Bid(req.body);
    await bid.save();
    res.status(201).json(bid);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all bids for a player
router.get('/player/:playerId', async (req, res) => {
  const bids = await Bid.find({ playerId: req.params.playerId }).sort({ timestamp: -1 });
  res.json(bids);
});

export default router; 