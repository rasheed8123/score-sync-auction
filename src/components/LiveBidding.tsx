
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, Users, Gavel } from 'lucide-react';
import { type Player } from '@/data/dummyData';
import { type Bid } from '@/data/auctionData';

interface LiveBiddingProps {
  currentPlayer: Player | null;
  bids: Bid[];
  onNewBid: (teamName: string, amount: number) => void;
  teams: string[];
}

export const LiveBidding = ({ currentPlayer, bids, onNewBid, teams }: LiveBiddingProps) => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [bidAmount, setBidAmount] = useState(0);

  useEffect(() => {
    if (currentPlayer) {
      const latestBid = bids.filter(bid => bid.playerId === currentPlayer.id)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
      setBidAmount(latestBid ? latestBid.amount + 100000 : currentPlayer.basePrice);
    }
  }, [currentPlayer, bids]);

  const playerBids = currentPlayer 
    ? bids.filter(bid => bid.playerId === currentPlayer.id)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    : [];

  const currentHighestBid = playerBids[0];

  const handleBid = () => {
    if (!currentPlayer || !selectedTeam || bidAmount <= (currentHighestBid?.amount || currentPlayer.basePrice)) {
      return;
    }
    onNewBid(selectedTeam, bidAmount);
    setSelectedTeam('');
  };

  if (!currentPlayer) {
    return (
      <Card className="bg-black/20 backdrop-blur-lg border-white/10">
        <CardContent className="p-8 text-center">
          <Gavel className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-400">No active auction</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Player & Highest Bid */}
      <Card className="bg-black/20 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Live Auction</span>
            <Badge className="bg-red-500 animate-pulse">LIVE</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">{currentPlayer.name}</h2>
            <div className="flex justify-center gap-2 mb-4">
              <Badge variant="secondary">{currentPlayer.sport}</Badge>
              <Badge variant="outline" className="border-white/20 text-gray-300">
                {currentPlayer.category}
              </Badge>
            </div>
            
            {currentHighestBid ? (
              <div className="space-y-2">
                <div className="text-4xl font-bold text-green-400">
                  ₹{(currentHighestBid.amount / 100000).toFixed(1)}L
                </div>
                <div className="text-lg text-blue-400">
                  Leading: {currentHighestBid.teamName}
                </div>
              </div>
            ) : (
              <div className="text-2xl font-bold text-yellow-400">
                Base Price: ₹{(currentPlayer.basePrice / 100000).toFixed(1)}L
              </div>
            )}
          </div>

          {/* Bidding Controls */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white"
              >
                <option value="">Select Team...</option>
                {teams.map(team => (
                  <option key={team} value={team} className="bg-gray-800">{team}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <span className="text-white">₹</span>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  className="flex-1 px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white"
                  step={100000}
                />
              </div>
            </div>
            <Button 
              onClick={handleBid}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!selectedTeam || bidAmount <= (currentHighestBid?.amount || currentPlayer.basePrice)}
            >
              Place Bid
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bid History */}
      <Card className="bg-black/20 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Bid History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {playerBids.map((bid, index) => (
              <div 
                key={bid.id} 
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index === 0 ? 'bg-green-500/20' : 'bg-white/5'
                }`}
              >
                <div>
                  <p className="text-white font-medium">{bid.teamName}</p>
                  <p className="text-xs text-gray-400">
                    {bid.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">
                    ₹{(bid.amount / 100000).toFixed(1)}L
                  </p>
                  {index === 0 && (
                    <Badge className="bg-green-500">Highest</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
