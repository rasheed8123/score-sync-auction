
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
}

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

export interface Bid {
  id: string;
  playerId: string;
  teamName: string;
  amount: number;
  timestamp: Date;
  auctionId: string;
}

export const dummyCategories: Category[] = [
  { 
    id: '1', 
    name: 'A+', 
    description: 'Premium players', 
    color: 'bg-red-500',
    minAmount: 5000000, // 50L
    maxAmount: 15000000, // 1.5Cr
    bidIncrement: 500000, // 5L
    minPlayersPerTeam: 1,
    maxPlayersPerTeam: 3
  },
  { 
    id: '2', 
    name: 'A', 
    description: 'Elite players', 
    color: 'bg-orange-500',
    minAmount: 2000000, // 20L
    maxAmount: 8000000, // 80L
    bidIncrement: 200000, // 2L
    minPlayersPerTeam: 2,
    maxPlayersPerTeam: 5
  },
  { 
    id: '3', 
    name: 'B+', 
    description: 'Good players', 
    color: 'bg-yellow-500',
    minAmount: 500000, // 5L
    maxAmount: 3000000, // 30L
    bidIncrement: 100000, // 1L
    minPlayersPerTeam: 3,
    maxPlayersPerTeam: 6
  },
  { 
    id: '4', 
    name: 'B', 
    description: 'Regular players', 
    color: 'bg-green-500',
    minAmount: 100000, // 1L
    maxAmount: 1000000, // 10L
    bidIncrement: 50000, // 50K
    minPlayersPerTeam: 4,
    maxPlayersPerTeam: 8
  },
];

export const dummyAuctions: Auction[] = [
  {
    id: '1',
    title: 'Premier Sports Auction 2024',
    date: '2024-03-15',
    totalTeams: 8,
    maxBidAmount: 50000000, // 5 Cr
    categories: dummyCategories,
    status: 'live',
    rules: 'Maximum bid amount per team: ₹5 Cr. Teams must maintain minimum budget for base price purchases. Category-wise player limits apply.'
  },
  {
    id: '2',
    title: 'Summer Championship Auction',
    date: '2024-06-20',
    totalTeams: 6,
    maxBidAmount: 30000000, // 3 Cr
    categories: dummyCategories,
    status: 'upcoming',
    rules: 'Maximum bid amount per team: ₹3 Cr. Category restrictions apply.'
  }
];

export const dummyBids: Bid[] = [
  {
    id: '1',
    playerId: '1',
    teamName: 'Mumbai Warriors',
    amount: 2500000,
    timestamp: new Date(Date.now() - 300000),
    auctionId: '1'
  },
  {
    id: '2',
    playerId: '1',
    teamName: 'Delhi Dynamos',
    amount: 2800000,
    timestamp: new Date(Date.now() - 240000),
    auctionId: '1'
  },
  {
    id: '3',
    playerId: '1',
    teamName: 'Chennai Challengers',
    amount: 3200000,
    timestamp: new Date(Date.now() - 120000),
    auctionId: '1'
  }
];
