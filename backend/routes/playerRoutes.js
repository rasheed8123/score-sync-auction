import express from 'express';
import Player from '../models/Player.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import Auction from '../models/Auction.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Register a new player with payment screenshot upload
router.post('/register', upload.single('paymentScreenshot'), async (req, res) => {
  try {
    let paymentScreenshotUrl = '';
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'auction-payments' },
        (error, result) => {
          if (error) throw error;
          paymentScreenshotUrl = result.secure_url;
        }
      );
      // Use a promise to wait for upload_stream to finish
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'auction-payments' },
          (error, result) => {
            if (error) reject(error);
            paymentScreenshotUrl = result.secure_url;
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
    }
    const player = new Player({
      ...req.body,
      paymentScreenshot: paymentScreenshotUrl,
      approved: false,
    });
    await player.save();
    res.status(201).json(player);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all players
router.get('/', async (req, res) => {
  const players = await Player.find();
  res.json(players);
});

// Update player (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { category, auction } = req.body;
    const player = await Player.findById(req.params.id);
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // If category is being updated, we need to set the base price
    if (category && auction) {
      const auctionDoc = await Auction.findById(auction);
      if (!auctionDoc) {
        return res.status(404).json({ error: 'Auction not found' });
      }

      const selectedCategory = auctionDoc.categories.find(cat => cat.name === category);
      if (!selectedCategory) {
        return res.status(400).json({ error: 'Invalid category for this auction' });
      }

      // Set the base price to the category's minimum amount
      req.body.basePrice = selectedCategory.minAmount;
    }

    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updatedPlayer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router; 