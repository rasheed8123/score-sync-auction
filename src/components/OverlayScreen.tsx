
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Users, Clock } from 'lucide-react';
import { type Player } from '@/data/dummyData';
import { type Bid } from '@/data/auctionData';

interface OverlayScreenProps {
  currentPlayer: Player | null;
  currentBid: Bid | null;
  highlights: string[];
  auctionTitle: string;
}

export const OverlayScreen = ({ currentPlayer, currentBid, highlights, auctionTitle }: OverlayScreenProps) => {
  const [currentHighlight, setCurrentHighlight] = useState(0);

  useEffect(() => {
    if (highlights.length > 0) {
      const interval = setInterval(() => {
        setCurrentHighlight((prev) => (prev + 1) % highlights.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [highlights]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

      {/* Main Content */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">{auctionTitle}</h1>
            <Badge className="bg-red-500 animate-pulse text-white">LIVE AUCTION</Badge>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-end">
          <div className="w-full grid grid-cols-3 gap-6 p-6">
            {/* Left: Current Player */}
            <Card className="bg-black/30 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  {currentPlayer ? (
                    <>
                      <h2 className="text-2xl font-bold text-white mb-2">{currentPlayer.name}</h2>
                      <div className="space-y-2">
                        <Badge variant="secondary">{currentPlayer.sport}</Badge>
                        <div className="text-lg text-gray-300">
                          Base: ₹{(currentPlayer.basePrice / 100000).toFixed(1)}L
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-400">No active auction</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Center: Current Bid */}
            <Card className="bg-black/30 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <Trophy className="h-12 w-12 mx-auto text-yellow-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Current Bid</h3>
                  {currentBid ? (
                    <>
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        ₹{(currentBid.amount / 100000).toFixed(1)}L
                      </div>
                      <div className="text-lg text-blue-400">
                        {currentBid.teamName}
                      </div>
                      <div className="text-sm text-gray-400 mt-2">
                        {currentBid.timestamp.toLocaleTimeString()}
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-400">No bids yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Right: Auction Status */}
            <Card className="bg-black/30 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <Clock className="h-12 w-12 mx-auto text-orange-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Auction Status</h3>
                  <div className="space-y-2">
                    <Badge className="bg-green-500">LIVE</Badge>
                    <div className="text-sm text-gray-300">
                      {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Marquee */}
        <div className="bg-black/50 backdrop-blur-lg border-t border-white/20 p-4">
          <div className="overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <span className="text-yellow-400 font-semibold mr-8">
                🏆 HIGHLIGHTS: 
              </span>
              {highlights.length > 0 ? (
                <span className="text-white">
                  {highlights[currentHighlight]}
                </span>
              ) : (
                <span className="text-gray-400">
                  Welcome to the {auctionTitle}! Get ready for exciting bidding wars!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};
