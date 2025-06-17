
export interface Player {
  id: string;
  name: string;
  sport: string;
  category: string;
  basePrice: number;
  currentPrice?: number;
  status: 'unsold' | 'sold' | 'bidding' | 'yet-to-auction';
  team?: string;
  image?: string;
  retentionPrice?: number;
  isRetained?: boolean;
}

export interface Team {
  id: string;
  name: string;
  sport: string;
  budget: number;
  remainingBudget: number;
  players: Player[];
  color: string;
  logo?: string;
}

export interface AuctionConfig {
  sports: string[];
  categories: {
    [sport: string]: string[];
  };
  bidIncrements: {
    [category: string]: number;
  };
  maxPlayersPerTeam: {
    [sport: string]: number;
  };
}

export const dummyPlayers: Player[] = [
  // Cricket Players
  {
    id: '1',
    name: 'Virat Kohli',
    sport: 'Cricket',
    category: 'Batsman',
    basePrice: 2000000,
    currentPrice: 15000000,
    status: 'sold',
    team: 'Mumbai Warriors',
    image: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Jasprit Bumrah',
    sport: 'Cricket',
    category: 'Bowler',
    basePrice: 1500000,
    currentPrice: 12000000,
    status: 'sold',
    team: 'Chennai Kings',
    image: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'MS Dhoni',
    sport: 'Cricket',
    category: 'Wicket Keeper',
    basePrice: 2500000,
    status: 'bidding',
    team: 'Delhi Capitals',
    image: '/placeholder.svg',
    isRetained: true,
    retentionPrice: 2500000
  },
  {
    id: '4',
    name: 'Rohit Sharma',
    sport: 'Cricket',
    category: 'Batsman',
    basePrice: 2000000,
    status: 'yet-to-auction',
    image: '/placeholder.svg'
  },
  {
    id: '5',
    name: 'Rashid Khan',
    sport: 'Cricket',
    category: 'All Rounder',
    basePrice: 1800000,
    status: 'unsold',
    image: '/placeholder.svg'
  },
  
  // Football Players
  {
    id: '6',
    name: 'Sunil Chhetri',
    sport: 'Football',
    category: 'Forward',
    basePrice: 500000,
    currentPrice: 1200000,
    status: 'sold',
    team: 'Bengaluru FC',
    image: '/placeholder.svg'
  },
  {
    id: '7',
    name: 'Gurpreet Sandhu',
    sport: 'Football',
    category: 'Goalkeeper',
    basePrice: 300000,
    status: 'yet-to-auction',
    image: '/placeholder.svg'
  },
  
  // Badminton Players
  {
    id: '8',
    name: 'PV Sindhu',
    sport: 'Badminton',
    category: 'Singles',
    basePrice: 800000,
    currentPrice: 2000000,
    status: 'sold',
    team: 'Hyderabad Hunters',
    image: '/placeholder.svg'
  },
  {
    id: '9',
    name: 'Saina Nehwal',
    sport: 'Badminton',
    category: 'Singles',
    basePrice: 700000,
    status: 'bidding',
    image: '/placeholder.svg'
  },
  
  // Volleyball Players
  {
    id: '10',
    name: 'Ajith Lal',
    sport: 'Volleyball',
    category: 'Spiker',
    basePrice: 200000,
    currentPrice: 450000,
    status: 'sold',
    team: 'Kerala Thunderbolts',
    image: '/placeholder.svg'
  },
  
  // Tennis Players
  {
    id: '11',
    name: 'Leander Paes',
    sport: 'Tennis',
    category: 'Doubles',
    basePrice: 600000,
    status: 'yet-to-auction',
    image: '/placeholder.svg'
  }
];

export const dummyTeams: Team[] = [
  {
    id: '1',
    name: 'Mumbai Warriors',
    sport: 'Cricket',
    budget: 80000000,
    remainingBudget: 65000000,
    players: dummyPlayers.filter(p => p.team === 'Mumbai Warriors'),
    color: '#1e40af',
    logo: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Chennai Kings',
    sport: 'Cricket',
    budget: 80000000,
    remainingBudget: 68000000,
    players: dummyPlayers.filter(p => p.team === 'Chennai Kings'),
    color: '#eab308',
    logo: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Delhi Capitals',
    sport: 'Cricket',
    budget: 80000000,
    remainingBudget: 77500000,
    players: dummyPlayers.filter(p => p.team === 'Delhi Capitals'),
    color: '#dc2626',
    logo: '/placeholder.svg'
  },
  {
    id: '4',
    name: 'Bengaluru FC',
    sport: 'Football',
    budget: 20000000,
    remainingBudget: 18800000,
    players: dummyPlayers.filter(p => p.team === 'Bengaluru FC'),
    color: '#059669',
    logo: '/placeholder.svg'
  },
  {
    id: '5',
    name: 'Hyderabad Hunters',
    sport: 'Badminton',
    budget: 15000000,
    remainingBudget: 13000000,
    players: dummyPlayers.filter(p => p.team === 'Hyderabad Hunters'),
    color: '#7c3aed',
    logo: '/placeholder.svg'
  },
  {
    id: '6',
    name: 'Kerala Thunderbolts',
    sport: 'Volleyball',
    budget: 10000000,
    remainingBudget: 9550000,
    players: dummyPlayers.filter(p => p.team === 'Kerala Thunderbolts'),
    color: '#ea580c',
    logo: '/placeholder.svg'
  }
];

export const auctionConfig: AuctionConfig = {
  sports: ['Cricket', 'Football', 'Badminton', 'Volleyball', 'Tennis'],
  categories: {
    Cricket: ['Batsman', 'Bowler', 'All Rounder', 'Wicket Keeper'],
    Football: ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'],
    Badminton: ['Singles', 'Doubles', 'Mixed Doubles'],
    Volleyball: ['Spiker', 'Setter', 'Libero', 'Middle Blocker'],
    Tennis: ['Singles', 'Doubles', 'Mixed Doubles']
  },
  bidIncrements: {
    'Batsman': 100000,
    'Bowler': 50000,
    'All Rounder': 75000,
    'Wicket Keeper': 50000,
    'Forward': 25000,
    'Midfielder': 20000,
    'Defender': 15000,
    'Goalkeeper': 10000,
    'Singles': 25000,
    'Doubles': 15000,
    'Mixed Doubles': 10000,
    'Spiker': 10000,
    'Setter': 8000,
    'Libero': 5000,
    'Middle Blocker': 7000
  },
  maxPlayersPerTeam: {
    Cricket: 25,
    Football: 30,
    Badminton: 15,
    Volleyball: 20,
    Tennis: 12
  }
};

// Demo login credentials
export const demoCredentials = {
  username: 'admin',
  password: 'auction123'
};
