import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  Gavel, 
  DollarSign, 
  Users, 
  Settings,
  Plus,
  Minus,
  Crown,
  Target,
  Trophy,
  Monitor,
  Download,
  ChevronDown,
  ChevronUp,
  UserPlus
} from 'lucide-react';
import { type Player, type Team, type Bid, type Auction } from '../types/models';
import { useToast } from '@/hooks/use-toast';
import { AuctionSetup } from '@/components/AuctionSetup';
import { LiveBidding } from '@/components/LiveBidding';
import { OverlayScreen } from '@/components/OverlayScreen';
import gsap from 'gsap';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Helper functions for status
const getStatusColor = (status: string) => {
  switch (status) {
    case 'sold':
      return 'bg-green-500';
    case 'unsold':
      return 'bg-red-500';
    case 'bidding':
      return 'bg-blue-500';
    case 'yet-to-auction':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'sold':
      return 'Sold';
    case 'unsold':
      return 'Unsold';
    case 'bidding':
      return 'Bidding';
    case 'yet-to-auction':
      return 'Yet to Auction';
    default:
      return status;
  }
};

// Add this helper function for card colors
const getCardColor = (status: string) => {
  switch (status) {
    case 'sold':
      return 'bg-green-900/20 border-green-500/20';
    case 'bidding':
      return 'bg-blue-900/20 border-blue-500/20';
    case 'yet-to-auction':
      return 'bg-gray-900/20 border-gray-500/20';
    default:
      return 'bg-black/20 border-white/10';
  }
};

export const AdminPanel = () => {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isAuctionActive, setIsAuctionActive] = useState(false);
  const [currentBid, setCurrentBid] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [bidIncrement, setBidIncrement] = useState(100000);
  const [showOverlay, setShowOverlay] = useState(false);
  const [expandedTeams, setExpandedTeams] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: playersRaw, isLoading: loadingPlayers, error: errorPlayers } = useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const res = await axios.get('/api/players');
      return res.data;
    },
    initialData: [],
  });
  const players: Player[] = Array.isArray(playersRaw) ? playersRaw : [];

  const { data: teamsRaw, isLoading: loadingTeams, error: errorTeams } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const res = await axios.get('/api/teams');
      return res.data;
    },
    initialData: [],
  });
  const teams: Team[] = Array.isArray(teamsRaw) ? teamsRaw : [];

  const { data: bidsRaw, isLoading: loadingBids, error: errorBids } = useQuery({
    queryKey: ['bids'],
    queryFn: async () => {
      const res = await axios.get('/api/bids');
      return res.data;
    },
    initialData: [],
  });
  const bids: Bid[] = Array.isArray(bidsRaw) ? bidsRaw : [];

  const { data: auctions = [] } = useQuery({
    queryKey: ['auctions'],
    queryFn: async () => {
      const res = await axios.get('/api/auction/all');
      return res.data;
    },
  });

  const [selectedAuctions, setSelectedAuctions] = useState<Record<string, string>>({});
  const [selectedCategories, setSelectedCategories] = useState<Record<string, string>>({});

  // Add state for selected auction
  const [selectedAuctionId, setSelectedAuctionId] = useState<string>('');

  // Add filtered players based on selected auction
  const filteredPlayers = players.filter(p => p.approved === true && (!selectedAuctionId || p.auction === selectedAuctionId));

  const startAuction = (player: Player) => {
    setCurrentPlayer(player);
    setCurrentBid(player.basePrice);
    setIsAuctionActive(true);
    setSelectedTeam('');
    
    // Update player status
    queryClient.setQueryData(['players'], (oldPlayers: Player[] | undefined) =>
      oldPlayers?.map(p => 
        p.id === player.id ? { ...p, status: 'bidding' } : p
      )
    );

    toast({
      title: "Auction Started",
      description: `Bidding for ${player.name} has begun!`,
    });
  };

  const handleNewBid = (teamName: string, amount: number) => {
    if (!currentPlayer) return;

    const newBid: Bid = {
      id: Date.now().toString(),
      playerId: currentPlayer.id,
      teamName,
      amount,
      timestamp: new Date(),
      auctionId: '1'
    };

    queryClient.setQueryData(['bids'], (oldBids: Bid[] | undefined) => [...(oldBids || []), newBid]);
    setCurrentBid(amount);

    toast({
      title: "New Bid Placed",
      description: `${teamName} bid ₹${(amount / 100000).toFixed(1)}L for ${currentPlayer.name}`,
    });
  };

  const increaseBid = () => {
    setCurrentBid(prev => prev + bidIncrement);
  };

  const decreaseBid = () => {
    setCurrentBid(prev => Math.max(prev - bidIncrement, currentPlayer?.basePrice || 0));
  };

  const sellPlayer = () => {
    if (!currentPlayer || !selectedTeam) {
      toast({
        title: "Error",
        description: "Please select a team to sell the player to.",
        variant: "destructive",
      });
      return;
    }

    // Add final bid
    const finalBid: Bid = {
      id: Date.now().toString(),
      playerId: currentPlayer.id,
      teamName: selectedTeam,
      amount: currentBid,
      timestamp: new Date(),
      auctionId: '1'
    };

    queryClient.setQueryData(['bids'], (oldBids: Bid[] | undefined) => [...(oldBids || []), finalBid]);

    queryClient.setQueryData(['players'], (oldPlayers: Player[] | undefined) =>
      oldPlayers?.map(p => 
        p.id === currentPlayer.id 
          ? { ...p, status: 'sold', currentPrice: currentBid, team: selectedTeam }
          : p
      )
    );

    toast({
      title: "Player Sold!",
      description: `${currentPlayer.name} sold to ${selectedTeam} for ₹${(currentBid / 100000).toFixed(1)}L`,
    });

    setIsAuctionActive(false);
    setCurrentPlayer(null);
    setCurrentBid(0);
    setSelectedTeam('');
  };

  const markUnsold = () => {
    if (!currentPlayer) return;

    queryClient.setQueryData(['players'], (oldPlayers: Player[] | undefined) =>
      oldPlayers?.map(p => 
        p.id === currentPlayer.id ? { ...p, status: 'unsold' } : p
      )
    );

    toast({
      title: "Player Unsold",
      description: `${currentPlayer.name} remains unsold.`,
    });

    setIsAuctionActive(false);
    setCurrentPlayer(null);
    setCurrentBid(0);
    setSelectedTeam('');
  };

  const resetPlayerStatus = (playerId: string) => {
    queryClient.setQueryData(['players'], (oldPlayers: Player[] | undefined) =>
      oldPlayers?.map(p =>
        p.id === playerId
          ? { ...p, status: 'yet-to-auction', currentPrice: undefined, team: undefined }
          : p
      )
    );
    toast({
      title: "Player Reset",
      description: "Player status has been reset.",
    });
  };

  const setPlayerBasePrice = (playerId: string, basePrice: number) => {
    queryClient.setQueryData(['players'], (oldPlayers: Player[] | undefined) =>
      oldPlayers?.map(p =>
        p.id === playerId ? { ...p, basePrice } : p
      )
    );
  };

  const setPlayerCategory = (playerId: string, category: string) => {
    queryClient.setQueryData(['players'], (oldPlayers: Player[] | undefined) =>
      oldPlayers?.map(p =>
        p.id === playerId ? { ...p, category } : p
      )
    );
  };

  const toggleTeamExpansion = (teamId: string) => {
    setExpandedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const exportTeamData = (team: Team) => {
    const teamData = {
      teamName: team.name,
      sport: team.sport,
      totalBudget: team.budget,
      remainingBudget: team.remainingBudget,
      spentBudget: team.budget - team.remainingBudget,
      totalPlayers: team.players.length,
      players: team.players.map(player => ({
        name: player.name,
        category: player.category,
        basePrice: player.basePrice,
        soldPrice: player.currentPrice || player.basePrice,
        sport: player.sport
      }))
    };

    const dataStr = JSON.stringify(teamData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${team.name.replace(/\s+/g, '_')}_team_data.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Export Successful",
      description: `${team.name} data has been exported.`,
    });
  };

  useEffect(() => {
    // Animate cards on load
    gsap.fromTo(
      '.admin-card',
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        stagger: 0.1,
        ease: "power2.out" 
      }
    );
  }, []);

  const soldPlayers = players.filter(p => p.status === 'sold');
  const unsoldPlayers = players.filter(p => p.status === 'unsold');
  const yetToAuction = players.filter(p => p.status === 'yet-to-auction');

  const teamNames = teams.map(team => team.name);
  const currentPlayerBids = currentPlayer 
    ? bids.filter(bid => bid.playerId === currentPlayer.id)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    : [];
  const currentHighestBid = currentPlayerBids[0];

  const highlights = [
    "Rajesh Kumar sold to Mumbai Warriors for ₹3.2L",
    "Intense bidding war for Priya Sharma between 3 teams!",
    "Chennai Challengers leading with aggressive bids",
    "Football auction starts next with exciting young talents"
  ];

  // Mutation for approving a player
  const approvePlayerMutation = useMutation<
    any,
    any,
    { playerId: string; auctionId: string },
    unknown
  >({
    mutationFn: async ({ playerId, auctionId }) => {
      const res = await axios.put(`/api/players/${playerId}`, { approved: true, auction: auctionId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      toast({ title: 'Player Approved', description: 'Player has been approved.' });
    },
    onError: (err: any) => {
      toast({ 
        title: 'Approval Failed', 
        description: err.response?.data?.error || 'Error approving player', 
        variant: 'destructive' 
      });
    },
  });

  // Unapproved players for admin review
  const unapprovedPlayers = players.filter(p => p.approved === false);

  // Update the mutation to use isPending
  const updatePlayerCategoryMutation = useMutation<
    any,
    any,
    { playerId: string; category: string; auction: string },
    unknown
  >({
    mutationFn: async ({ playerId, category, auction }) => {
      const res = await axios.put(`/api/players/${playerId}`, { category, auction });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      toast({ title: 'Category Updated', description: 'Player category and base price have been updated.' });
    },
    onError: (err: any) => {
      toast({ 
        title: 'Update Failed', 
        description: err.response?.data?.error || 'Error updating category', 
        variant: 'destructive' 
      });
    },
  });

  // Add this query to fetch the player's auction
  const { data: playerAuction } = useQuery({
    queryKey: ['auction', currentPlayer?.auction],
    queryFn: async () => {
      if (!currentPlayer?.auction) return null;
      const res = await axios.get(`/api/auction/${currentPlayer.auction}`);
      return res.data;
    },
    enabled: !!currentPlayer?.auction,
  });

  // Update the category selection handler
  const handleCategoryChange = (playerId: string, category: string, auctionId: string) => {
    updatePlayerCategoryMutation.mutate({ playerId, category, auction: auctionId });
  };

  // Add team creation mutation
  const createTeamMutation = useMutation({
    mutationFn: async (teamData: {
      name: string;
      sport: string;
      captain: string;
      viceCaptain: string;
      auctionId: string;
    }) => {
      const response = await fetch('/api/teams/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create team');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team created successfully');
      setShowCreateTeam(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Add state for team creation form
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    sport: '',
    captain: '',
    viceCaptain: '',
    auctionId: '',
  });

  if (showOverlay) {
    return (
      <div className="relative">
        <Button
          onClick={() => setShowOverlay(false)}
          className="absolute top-4 right-4 z-20 bg-red-600 hover:bg-red-700"
        >
          Exit Overlay
        </Button>
        <OverlayScreen 
          currentPlayer={currentPlayer}
          currentBid={currentHighestBid}
          highlights={highlights}
          auctionTitle="Premier Sports Auction 2024"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Auction Control Panel
            </h1>
            <p className="text-gray-300">
              Manage the live auction from here
            </p>
          </div>
          <Button
            onClick={() => setShowOverlay(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Monitor className="h-4 w-4 mr-2" />
            Show Overlay
          </Button>
        </div>

        <Tabs defaultValue="auction" className="space-y-6">
          <TabsList className="bg-black/20 border-white/10">
            <TabsTrigger value="auction" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Live Auction
            </TabsTrigger>
            <TabsTrigger value="approvals" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Approvals
            </TabsTrigger>
            <TabsTrigger value="setup" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Auction Setup
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Manage Players
            </TabsTrigger>
            <TabsTrigger value="teams" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Team Overview
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="auction" className="space-y-6">
            {/* Auction Selection */}
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Select Auction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {auctions.map((auction) => (
                    <Card 
                      key={auction._id} 
                      className={`cursor-pointer transition-all ${
                        selectedAuctionId === auction._id 
                          ? 'bg-white/20 border-white/40' 
                          : 'bg-black/20 border-white/10 hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedAuctionId(auction._id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-white">{auction.title}</h3>
                          <Badge variant={auction.status === 'live' ? 'default' : 'secondary'}>
                            {auction.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-400">
                          <p>Date: {new Date(auction.date).toLocaleDateString()}</p>
                          <p>Teams: {auction.totalTeams}</p>
                          <p>Categories: {auction.categories.length}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Show auction details only if an auction is selected */}
            {selectedAuctionId ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <LiveBidding
                    currentPlayer={currentPlayer}
                    bids={bids}
                    onNewBid={handleNewBid}
                    auctionId={selectedAuctionId}
                  />

                  {/* Players Queue */}
                  <Card className="bg-black/20 backdrop-blur-lg border-white/10 admin-card">
                    <CardHeader>
                      <CardTitle className="text-white">Yet to Auction ({yetToAuction.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {yetToAuction.map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            <div>
                              <p className="text-white font-medium">{player.name}</p>
                              <p className="text-sm text-gray-400">
                                {player.category} • ₹{(player.basePrice / 100000).toFixed(1)}L
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              className="bg-white text-black hover:bg-gray-100 hover:text-black"
                              onClick={() => startAuction(player)}
                              disabled={isAuctionActive || player.status === 'sold'}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Start Auction
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                {isAuctionActive && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button
                      onClick={increaseBid}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Increase Bid
                    </Button>
                    <Button
                      onClick={decreaseBid}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Minus className="h-4 w-4 mr-2" />
                      Decrease Bid
                    </Button>
                    <Button
                      onClick={sellPlayer}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={!selectedTeam}
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Sell Player
                    </Button>
                    <Button
                      onClick={markUnsold}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Mark Unsold
                    </Button>
                  </div>
                )}

                {/* Auction Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-black/20 backdrop-blur-lg border-white/10 admin-card">
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-green-400 mb-2">
                        {soldPlayers.length}
                      </div>
                      <div className="text-white">Players Sold</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/20 backdrop-blur-lg border-white/10 admin-card">
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-red-400 mb-2">
                        {unsoldPlayers.length}
                      </div>
                      <div className="text-white">Players Unsold</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/20 backdrop-blur-lg border-white/10 admin-card">
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-yellow-400 mb-2">
                        {yetToAuction.length}
                      </div>
                      <div className="text-white">Yet to Auction</div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Select an Auction</h3>
                <p className="text-gray-400">Choose an auction from above to view its details and manage the bidding process.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="approvals" className="space-y-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Pending Player Approvals</h2>
              {unapprovedPlayers.length === 0 ? (
                <p className="text-gray-400">No players pending approval.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unapprovedPlayers.map(player => (
                    <Card key={player.id} className="bg-black/20 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white">{player.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-2 text-gray-300">Sport: {player.sport}</div>
                        <div className="mb-2 text-gray-300">Email: {player.email}</div>
                        <div className="mb-2 text-gray-300">Contact: {player.contact}</div>
                        <div className="mb-2 text-gray-300">Achievements: {player.achievements}</div>
                        {player.paymentScreenshot && (
                          <div className="mb-2">
                            <a href={player.paymentScreenshot} target="_blank" rel="noopener noreferrer">
                              <img src={player.paymentScreenshot} alt="Payment Screenshot" className="max-h-40 rounded border border-white/20" />
                            </a>
                          </div>
                        )}
                        <div className="mb-2">
                          <select
                            className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white"
                            value={selectedAuctions[player._id || player.id] || ''}
                            onChange={e => setSelectedAuctions(sa => ({ ...sa, [player._id || player.id]: e.target.value }))}
                          >
                            <option value="">Select Auction...</option>
                            {auctions.map((auction: any) => (
                              <option key={auction._id || auction.id} value={auction._id || auction.id}>{auction.title}</option>
                            ))}
                          </select>
                        </div>
                        <Button
                          variant="outline"
                          className="bg-white text-black hover:bg-gray-100 hover:text-black"
                          onClick={() => approvePlayerMutation.mutate({ playerId: player._id || player.id, auctionId: selectedAuctions[player._id || player.id] })}
                          disabled={approvePlayerMutation.isPending || !selectedAuctions[player._id || player.id]}
                        >
                          {approvePlayerMutation.isPending ? 'Approving...' : 'Approve'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="setup">
            <AuctionSetup />
          </TabsContent>

          <TabsContent value="players" className="space-y-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Approved Players</h2>
              {players.filter(p => p.approved === true).length === 0 ? (
                <p className="text-gray-400">No approved players.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {players.filter(p => p.approved === true).map((player) => {
                    const playerAuction = auctions.find(a => a._id === player.auction);
                    const selectedCategory = playerAuction?.categories.find(c => c.name === player.category);
                    
                    return (
                      <Card key={player._id} className={`mb-4 ${getCardColor(player.status)}`}>
                        <CardHeader>
                          <CardTitle className="flex justify-between items-center">
                            <div>
                              <span className="text-xl font-bold">{player.name}</span>
                              {playerAuction && (
                                <div className="text-sm text-gray-400 mt-1">
                                  Auction: {playerAuction.title}
                                </div>
                              )}
                            </div>
                            <Badge variant={player.status === 'sold' ? 'default' : 'secondary'}>
                              {player.status}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <p className="flex items-center">
                                <span className="text-gray-400 w-24">Sport:</span>
                                <span className="font-medium">{player.sport}</span>
                              </p>
                              <p className="flex items-center">
                                <span className="text-gray-400 w-24">Experience:</span>
                                <span className="font-medium">{player.experience}</span>
                              </p>
                              <p className="flex items-center">
                                <span className="text-gray-400 w-24">Base Price:</span>
                                <span className="font-medium text-green-400">
                                  ₹{player.basePrice?.toLocaleString() || 'Not set'}
                                </span>
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`category-${player._id}`} className="text-gray-400">Category</Label>
                              <select
                                id={`category-${player._id}`}
                                value={player.category || ''}
                                onChange={(e) => handleCategoryChange(player._id, e.target.value, player.auction)}
                                className="w-full p-2 rounded bg-black/20 border border-white/10 text-white"
                                disabled={updatePlayerCategoryMutation.isPending}
                              >
                                <option value="">Select Category</option>
                                {playerAuction?.categories.map((cat) => (
                                  <option key={cat.name} value={cat.name} className="bg-gray-800">
                                    {cat.name} (₹{cat.minAmount.toLocaleString()} - ₹{cat.maxAmount.toLocaleString()})
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Team Overview</h2>
              <Button
                onClick={() => setShowCreateTeam(true)}
                className="bg-white text-black hover:bg-gray-100 hover:text-black"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </div>

            {/* Team Creation Dialog */}
            {showCreateTeam && (
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Create New Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    createTeamMutation.mutate(newTeam);
                  }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="teamName">Team Name</Label>
                        <Input
                          id="teamName"
                          value={newTeam.name}
                          onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                          required
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sport">Sport</Label>
                        <Input
                          id="sport"
                          value={newTeam.sport}
                          onChange={(e) => setNewTeam({ ...newTeam, sport: e.target.value })}
                          required
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="captain">Captain Name</Label>
                        <Input
                          id="captain"
                          value={newTeam.captain}
                          onChange={(e) => setNewTeam({ ...newTeam, captain: e.target.value })}
                          required
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="viceCaptain">Vice Captain Name</Label>
                        <Input
                          id="viceCaptain"
                          value={newTeam.viceCaptain}
                          onChange={(e) => setNewTeam({ ...newTeam, viceCaptain: e.target.value })}
                          required
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="auction">Select Auction</Label>
                        <Select
                          value={newTeam.auctionId}
                          onValueChange={(value) => setNewTeam({ ...newTeam, auctionId: value })}
                          required
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select an auction" />
                          </SelectTrigger>
                          <SelectContent>
                            {auctions.map((auction) => (
                              <SelectItem key={auction._id} value={auction._id}>
                                {auction.title} ({new Date(auction.date).toLocaleDateString()})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreateTeam(false)}
                        className="bg-white text-black hover:bg-gray-100 hover:text-black"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createTeamMutation.isPending}
                        className="bg-white text-black hover:bg-gray-100 hover:text-black"
                      >
                        {createTeamMutation.isPending ? 'Creating...' : 'Create Team'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Card key={team._id} className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">{team.name}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {team.sport} • {team.players.length} Players
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Captain:</span>
                          <span className="text-white">{team.captain}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Vice Captain:</span>
                          <span className="text-white">{team.viceCaptain}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Budget:</span>
                          <span className="text-white">₹{(team.budget / 100000).toFixed(1)}L</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Remaining:</span>
                          <span className="text-white">₹{(team.remainingBudget / 100000).toFixed(1)}L</span>
                        </div>
                      </div>

                      {/* Players Dropdown */}
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-300">Team Players</h4>
                          <Badge variant="secondary">{team.players.length}</Badge>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {team.players.length > 0 ? (
                            team.players.map((player) => (
                              <div
                                key={player._id}
                                className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                              >
                                <div>
                                  <div className="text-white font-medium">{player.name}</div>
                                  <div className="text-sm text-gray-400">
                                    {player.category} • ₹{(player.currentPrice || player.basePrice) / 100000}L
                                  </div>
                                </div>
                                <Badge
                                  variant={
                                    player.status === 'sold'
                                      ? 'default'
                                      : player.status === 'bidding'
                                      ? 'secondary'
                                      : 'outline'
                                  }
                                >
                                  {player.status}
                                </Badge>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-gray-400">
                              No players in this team yet
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10 admin-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Auction Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Bid Increment</Label>
                  <Input
                    type="number"
                    value={bidIncrement}
                    onChange={(e) => setBidIncrement(Number(e.target.value))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Auto-refresh Dashboard</span>
                  <Button variant="outline" className="border-white/20 text-white">
                    Enable
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
