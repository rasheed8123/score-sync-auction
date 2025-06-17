
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
  { id: '1', name: 'A+', description: 'Premium players', color: 'bg-red-500' },
  { id: '2', name: 'A', description: 'Elite players', color: 'bg-orange-500' },
  { id: '3', name: 'B+', description: 'Good players', color: 'bg-yellow-500' },
  { id: '4', name: 'B', description: 'Regular players', color: 'bg-green-500' },
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
    rules: 'Maximum bid amount per team: ₹5 Cr. Teams must maintain minimum budget for base price purchases.'
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
