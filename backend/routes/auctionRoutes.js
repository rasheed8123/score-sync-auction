import express from 'express';
import Auction from '../models/Auction.js';

const router = express.Router();

// Get current auction state
router.get('/', async (req, res) => {
  const auction = await Auction.findOne({});
  res.json(auction);
});

// Start auction for a player
router.post('/start', async (req, res) => {
  const { playerId } = req.body;
  let auction = await Auction.findOne({});
  if (!auction) auction = new Auction();
  auction.currentPlayer = playerId;
  auction.isActive = true;
  await auction.save();
  res.json(auction);
});

// Stop auction
router.post('/stop', async (req, res) => {
  let auction = await Auction.findOne({});
  if (!auction) return res.status(404).json({ error: 'No auction found' });
  auction.isActive = false;
  auction.currentPlayer = null;
  await auction.save();
  res.json(auction);
});

// Add highlight
router.post('/highlight', async (req, res) => {
  const { highlight } = req.body;
  let auction = await Auction.findOne({});
  if (!auction) auction = new Auction();
  auction.highlights = auction.highlights || [];
  auction.highlights.push(highlight);
  await auction.save();
  res.json(auction);
});

// Create a new auction
router.post('/', async (req, res) => {
  try {
    console.log('Received auction creation request:', req.body);
    
    // Validate required fields
    const requiredFields = ['title', 'date', 'totalTeams', 'maxBidAmount', 'categories'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Create new auction
    const auction = new Auction(req.body);
    console.log('Created auction object:', auction);
    
    // Save to database
    const savedAuction = await auction.save();
    console.log('Saved auction:', savedAuction);
    
    res.status(201).json(savedAuction);
  } catch (err) {
    console.error('Error creating auction:', err);
    res.status(400).json({ 
      error: err.message || 'Failed to create auction',
      details: err.errors // Include validation errors if any
    });
  }
});

// Get all upcoming auctions
router.get('/all', async (req, res) => {
  const auctions = await Auction.find({ status: 'upcoming' });
  res.json(auctions);
});

// Get all auctions (for listing in AuctionSetup)
router.get('/list', async (req, res) => {
  const auctions = await Auction.find();
  res.json(auctions);
});

// Update an auction (only if date is not past)
router.put('/:id', async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ error: 'Auction not found' });
    const now = new Date();
    const auctionDate = new Date(auction.date);
    if (auctionDate < now) {
      return res.status(400).json({ error: 'Cannot update auction after its date' });
    }
    Object.assign(auction, req.body);
    await auction.save();
    res.json(auction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a single auction by ID
router.get('/:id', async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ error: 'Auction not found' });
    res.json(auction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router; 