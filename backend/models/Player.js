import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  name: String,
  sport: String,
  category: String,
  experience: String,
  achievements: String,
  contact: String,
  email: String,
  status: { type: String, default: 'yet-to-auction' },
  basePrice: Number,
  currentPrice: Number,
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  paymentScreenshot: String,
  approved: { type: Boolean, default: false },
  auction: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction' },
});

export default mongoose.model('Player', playerSchema); 