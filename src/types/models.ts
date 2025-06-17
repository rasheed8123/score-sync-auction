// Player
export interface Player {
  id: string;
  _id?: string;
  name: string;
  sport: string;
  category: string;
  experience: string;
  basePrice: number;
  currentPrice?: number;
  status: 'unsold' | 'sold' | 'bidding' | 'yet-to-auction';
  team?: string;
  image?: string;
  retentionPrice?: number;
  isRetained?: boolean;
  auction?: string;
  email?: string;
  contact?: string;
  achievements?: string;
  paymentScreenshot?: string;
  approved?: boolean;
}

// Team
export interface Team {
  _id: string;
  name: string;
  sport: string;
  captain: string;
  viceCaptain: string;
  budget: number;
  remainingBudget: number;
  players: Player[];
  auction: string;
  createdAt: string;
  color: string;
  logo?: string;
}

// Auction
export interface Auction {
  id: string;
  title: string;
  date: string;
  totalTeams: number;
  logo?: string;
  banner?: string;
  maxBidAmount: number;
  categories: Category[];
  status: 'upcoming' | 'live' | 'completed';
  rules: string;
  currentPlayer?: string;
  isActive?: boolean;
  highlights?: string[];
}

// Category
export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  minAmount: number;
  maxAmount: number;
  bidIncrement: number;
  minPlayersPerTeam: number;
  maxPlayersPerTeam: number;
}

// Bid
export interface Bid {
  id: string;
  playerId: string;
  teamName: string;
  amount: number;
  timestamp: Date;
  auctionId: string;
} 