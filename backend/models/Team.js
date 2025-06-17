import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sport: { type: String, required: true },
  captain: { type: String, required: true },
  viceCaptain: { type: String, required: true },
  budget: { type: Number, required: true },
  remainingBudget: { type: Number, required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  auction: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Team', teamSchema); 