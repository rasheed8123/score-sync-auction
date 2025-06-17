import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, DollarSign, User } from 'lucide-react';
import { type Player } from '@/types/models';

interface PlayerCardProps {
  player: Player;
  className?: string;
  style?: React.CSSProperties;
}

export const PlayerCard = ({ player, className, style }: PlayerCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sold': return 'bg-green-500';
      case 'unsold': return 'bg-red-500';
      case 'bidding': return 'bg-yellow-500 animate-pulse';
      case 'yet-to-auction': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'yet-to-auction': return 'Yet to Auction';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <Card 
      className={`bg-black/20 backdrop-blur-lg border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${className}`}
      style={style}
    >
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">{player.name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {player.sport}
              </Badge>
              <Badge variant="outline" className="text-xs border-white/20 text-gray-300">
                {player.category}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Base Price:</span>
            <span className="text-white font-medium">
              ₹{(player.basePrice / 100000).toFixed(1)}L
            </span>
          </div>

          {player.currentPrice && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Current Price:</span>
              <span className="text-green-400 font-bold">
                ₹{(player.currentPrice / 100000).toFixed(1)}L
              </span>
            </div>
          )}

          {player.team && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Team:</span>
              <span className="text-blue-400 font-medium">{player.team}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Status:</span>
            <Badge className={`${getStatusColor(player.status)} text-white`}>
              {getStatusText(player.status)}
            </Badge>
          </div>

          {player.isRetained && (
            <div className="flex items-center justify-center mt-3 p-2 bg-yellow-500/20 rounded-md">
              <Trophy className="h-4 w-4 text-yellow-400 mr-2" />
              <span className="text-yellow-400 text-sm font-medium">Retained Player</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
