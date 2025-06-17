
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Users, Clock } from 'lucide-react';
import { type Player } from '@/data/dummyData';
import { type Bid } from '@/data/auctionData';
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
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
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
    <div className="fixed inset-0 pointer-events-none">
      {/* Player Details - Left */}
      {currentPlayer && (
        <div className="absolute top-6 left-6 player-card">
          <Card className="bg-black/80 backdrop-blur-md border-purple-500/30 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{currentPlayer.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs">{currentPlayer.sport}</Badge>
                    <Badge className="bg-yellow-500 text-black text-xs">{currentPlayer.category}</Badge>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">
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
        <div className="absolute top-6 right-6 bid-card">
          <Card className="bg-black/80 backdrop-blur-md border-green-500/30 shadow-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <Trophy className="h-8 w-8 mx-auto text-yellow-400 mb-2" />
                <div className="text-2xl font-bold text-green-400">
                  ₹{(currentBid.amount / 100000).toFixed(1)}L
                </div>
                <div className="text-lg text-blue-400 font-medium">
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

      {/* Bottom Marquee */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md border-t border-purple-500/30">
        <div className="overflow-hidden py-3">
          <div className="animate-marquee whitespace-nowrap text-white">
            <span className="text-yellow-400 font-semibold mr-8">
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
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};
