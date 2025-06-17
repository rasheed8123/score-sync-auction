import express from 'express';
import Team from '../models/Team.js';
import Auction from '../models/Auction.js';

const router = express.Router();

// Get all teams
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find().populate('auction', 'title date');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams', error: error.message });
  }
});

// Create a new team
router.post('/create', async (req, res) => {
  try {
    const { name, sport, captain, viceCaptain, auctionId } = req.body;

    // Check if auction exists and has space for new team
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Count existing teams for this auction
    const existingTeamsCount = await Team.countDocuments({ auction: auctionId });
    if (existingTeamsCount >= auction.totalTeams) {
      return res.status(400).json({ message: 'Maximum number of teams reached for this auction' });
    }

    // Create new team
    const team = new Team({
      name,
      sport,
      captain,
      viceCaptain,
      budget: auction.maxBidAmount,
      remainingBudget: auction.maxBidAmount,
      auction: auctionId
    });

    await team.save();
    res.status(201).json(team);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ message: 'Error creating team', error: error.message });
  }
});

// Get teams by auction
router.get('/auction/:auctionId', async (req, res) => {
  try {
    const teams = await Team.find({ auction: req.params.auctionId });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams', error: error.message });
  }
});

// Update team
router.put('/:id', async (req, res) => {
  const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(team);
});

export default router; 