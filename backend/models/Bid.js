import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  amount: Number,
  timestamp: { type: Date, default: Date.now },
  auctionId: String,
});

export default mongoose.model('Bid', bidSchema); 