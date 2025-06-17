import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  color: String,
  minAmount: Number,
  maxAmount: Number,
  bidIncrement: Number,
  minPlayersPerTeam: Number,
  maxPlayersPerTeam: Number,
}, { _id: false });

const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  totalTeams: { type: Number, required: true },
  logo: String,
  banner: String,
  maxBidAmount: { type: Number, required: true },
  categories: [categorySchema],
  status: { type: String, enum: ['upcoming', 'live', 'completed'], default: 'upcoming' },
  rules: String,
  currentPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  isActive: { type: Boolean, default: false },
  highlights: [String],
});

export default mongoose.model('Auction', auctionSchema); 