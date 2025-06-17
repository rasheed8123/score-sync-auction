
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Monitor
} from 'lucide-react';
import { dummyPlayers, dummyTeams, type Player, type Team } from '@/data/dummyData';
import { dummyBids, type Bid } from '@/data/auctionData';
import { useToast } from '@/hooks/use-toast';
import { AuctionSetup } from '@/components/AuctionSetup';
import { LiveBidding } from '@/components/LiveBidding';
import { OverlayScreen } from '@/components/OverlayScreen';
import gsap from 'gsap';

export const AdminPanel = () => {
  const [players, setPlayers] = useState<Player[]>(dummyPlayers);
  const [teams] = useState<Team[]>(dummyTeams);
  const [bids, setBids] = useState<Bid[]>(dummyBids);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isAuctionActive, setIsAuctionActive] = useState(false);
  const [currentBid, setCurrentBid] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [bidIncrement, setBidIncrement] = useState(100000);
  const [showOverlay, setShowOverlay] = useState(false);
  const { toast } = useToast();

  const startAuction = (player: Player) => {
    setCurrentPlayer(player);
    setCurrentBid(player.basePrice);
    setIsAuctionActive(true);
    setSelectedTeam('');
    
    // Update player status
    setPlayers(prev => prev.map(p => 
      p.id === player.id ? { ...p, status: 'bidding' } : p
    ));

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

    setBids(prev => [...prev, newBid]);
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

    setBids(prev => [...prev, finalBid]);

    setPlayers(prev => prev.map(p => 
      p.id === currentPlayer.id 
        ? { ...p, status: 'sold', currentPrice: currentBid, team: selectedTeam }
        : p
    ));

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

    setPlayers(prev => prev.map(p => 
      p.id === currentPlayer.id ? { ...p, status: 'unsold' } : p
    ));

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
    setPlayers(prev => prev.map(p => 
      p.id === playerId 
        ? { ...p, status: 'yet-to-auction', currentPrice: undefined, team: undefined }
        : p
    ));

    toast({
      title: "Player Reset",
      description: "Player status has been reset.",
    });
  };

  const setPlayerBasePrice = (playerId: string, basePrice: number) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, basePrice } : p
    ));
  };

  const setPlayerCategory = (playerId: string, category: string) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, category } : p
    ));
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LiveBidding
                currentPlayer={currentPlayer}
                bids={bids}
                onNewBid={handleNewBid}
                teams={teamNames}
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
                          onClick={() => startAuction(player)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={isAuctionActive}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            {currentPlayer && (
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </TabsContent>

          <TabsContent value="setup">
            <AuctionSetup />
          </TabsContent>

          <TabsContent value="players" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player) => (
                <Card key={player.id} className="bg-black/20 backdrop-blur-lg border-white/10 admin-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-medium">{player.name}</h3>
                      <Badge 
                        className={
                          player.status === 'sold' ? 'bg-green-500' :
                          player.status === 'unsold' ? 'bg-red-500' :
                          player.status === 'bidding' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }
                      >
                        {player.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>{player.sport} • {player.category}</p>
                      <div className="flex items-center gap-2">
                        <span>Base:</span>
                        <input
                          type="number"
                          value={player.basePrice}
                          onChange={(e) => setPlayerBasePrice(player.id, Number(e.target.value))}
                          className="w-20 px-1 py-0.5 text-xs bg-white/10 border border-white/20 rounded text-white"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Category:</span>
                        <select
                          value={player.category}
                          onChange={(e) => setPlayerCategory(player.id, e.target.value)}
                          className="px-1 py-0.5 text-xs bg-white/10 border border-white/20 rounded text-white"
                        >
                          <option value="A+">A+</option>
                          <option value="A">A</option>
                          <option value="B+">B+</option>
                          <option value="B">B</option>
                        </select>
                      </div>
                      {player.currentPrice && (
                        <p>Sold: ₹{(player.currentPrice / 100000).toFixed(1)}L</p>
                      )}
                      {player.team && <p>Team: {player.team}</p>}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        onClick={() => startAuction(player)}
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        disabled={isAuctionActive || player.status === 'bidding'}
                      >
                        Auction
                      </Button>
                      <Button
                        onClick={() => resetPlayerStatus(player.id)}
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teams.map((team) => (
                <Card key={team.id} className="bg-black/20 backdrop-blur-lg border-white/10 admin-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>{team.name}</span>
                      <Badge variant="secondary">{team.sport}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Budget Remaining:</span>
                        <span className="text-green-400 font-bold">
                          ₹{(team.remainingBudget / 10000000).toFixed(1)}Cr
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Players:</span>
                        <span className="text-white">{team.players.length}</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Recent Acquisitions:</h4>
                        {team.players.slice(0, 3).map((player, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">{player.name}</span>
                            <span className="text-green-400">
                              ₹{((player.currentPrice || player.basePrice) / 100000).toFixed(1)}L
                            </span>
                          </div>
                        ))}
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
