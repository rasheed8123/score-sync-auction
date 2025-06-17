import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Users, Clock } from 'lucide-react';
import { type Player, type Bid } from '@/types/models';
import gsap from 'gsap';

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

  useEffect(() => {
    // Animate player card entrance
    if (currentPlayer) {
      gsap.fromTo(
        '.player-card',
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [currentPlayer]);

  useEffect(() => {
    // Animate bid updates
    if (currentBid) {
      gsap.fromTo(
        '.bid-card',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [currentBid]);

  return (
    <div className="fixed inset-0 pointer-events-none bg-transparent">
      {/* Bottom Section with Player and Bid Details */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-between px-6">
        {/* Player Details - Left */}
        {currentPlayer && (
          <div className="player-card">
            <Card className="bg-black/90 backdrop-blur-md border-purple-500/50 shadow-2xl">
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{currentPlayer.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">{currentPlayer.sport}</Badge>
                      <Badge className="bg-yellow-500 text-black text-xs">{currentPlayer.category}</Badge>
                    </div>
                    <p className="text-xs text-gray-300">
                      Base: ₹{(currentPlayer.basePrice / 100000).toFixed(1)}L
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Current Bid - Right */}
        {currentBid && (
          <div className="bid-card">
            <Card className="bg-black/90 backdrop-blur-md border-green-500/50 shadow-2xl">
              <CardContent className="p-3">
                <div className="text-center">
                  <Trophy className="h-6 w-6 mx-auto text-yellow-400 mb-1" />
                  <div className="text-xl font-bold text-green-400">
                    ₹{(currentBid.amount / 100000).toFixed(1)}L
                  </div>
                  <div className="text-sm text-blue-400 font-medium">
                    {currentBid.teamName}
                  </div>
                  <div className="text-xs text-gray-400">
                    {currentBid.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Marquee */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-purple-500/30">
        <div className="overflow-hidden py-2">
          <div className="animate-marquee whitespace-nowrap text-white text-sm">
            <span className="text-yellow-400 font-semibold mr-6">
              🏆 HIGHLIGHTS: 
            </span>
            {highlights.length > 0 ? (
              <span>
                {highlights[currentHighlight]}
              </span>
            ) : (
              <span className="text-gray-300">
                Welcome to the {auctionTitle}! Get ready for exciting bidding wars!
              </span>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </div>
  );
};
