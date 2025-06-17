
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
  Target
} from 'lucide-react';
import { dummyPlayers, dummyTeams, type Player, type Team } from '@/data/dummyData';
import { useToast } from '@/hooks/use-toast';
import gsap from 'gsap';

export const AdminPanel = () => {
  const [players, setPlayers] = useState<Player[]>(dummyPlayers);
  const [teams] = useState<Team[]>(dummyTeams);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isAuctionActive, setIsAuctionActive] = useState(false);
  const [currentBid, setCurrentBid] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [bidIncrement, setBidIncrement] = useState(100000);
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

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Auction Control Panel
          </h1>
          <p className="text-gray-300">
            Manage the live auction from here
          </p>
        </div>

        <Tabs defaultValue="auction" className="space-y-6">
          <TabsList className="bg-black/20 border-white/10">
            <TabsTrigger value="auction" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Live Auction
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
            {/* Live Auction Control */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Auction */}
              <Card className="bg-black/20 backdrop-blur-lg border-white/10 admin-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Gavel className="h-5 w-5 mr-2" />
                    Current Auction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentPlayer ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {currentPlayer.name}
                        </h3>
                        <div className="flex justify-center gap-2 mb-4">
                          <Badge variant="secondary">{currentPlayer.sport}</Badge>
                          <Badge variant="outline" className="border-white/20 text-gray-300">
                            {currentPlayer.category}
                          </Badge>
                        </div>
                        <div className="text-3xl font-bold text-green-400 mb-4">
                          ₹{(currentBid / 100000).toFixed(1)}L
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Button
                          onClick={decreaseBid}
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-white px-4">
                          ₹{(bidIncrement / 100000).toFixed(1)}L
                        </span>
                        <Button
                          onClick={increaseBid}
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Select Team</Label>
                        <select
                          value={selectedTeam}
                          onChange={(e) => setSelectedTeam(e.target.value)}
                          className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white"
                        >
                          <option value="">Select a team...</option>
                          {teams
                            .filter(team => team.sport === currentPlayer.sport)
                            .map(team => (
                              <option key={team.id} value={team.name} className="bg-gray-800">
                                {team.name} (₹{(team.remainingBudget / 10000000).toFixed(1)}Cr left)
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={sellPlayer}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          disabled={!selectedTeam}
                        >
                          <Crown className="h-4 w-4 mr-2" />
                          Sell
                        </Button>
                        <Button
                          onClick={markUnsold}
                          className="flex-1 bg-red-600 hover:bg-red-700"
                        >
                          Mark Unsold
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-400">No auction in progress</p>
                      <p className="text-sm text-gray-500">Select a player to start bidding</p>
                    </div>
                  )}
                </CardContent>
              </Card>

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
                      <p>Base: ₹{(player.basePrice / 100000).toFixed(1)}L</p>
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
