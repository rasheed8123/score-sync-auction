
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, Trophy } from 'lucide-react';
import { type Team } from '@/data/dummyData';

interface TeamCardProps {
  team: Team;
  className?: string;
  style?: React.CSSProperties;
}

export const TeamCard = ({ team, className, style }: TeamCardProps) => {
  const spentBudget = team.budget - team.remainingBudget;
  const budgetPercentage = (spentBudget / team.budget) * 100;

  return (
    <Card 
      className={`bg-black/20 backdrop-blur-lg border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${className}`}
      style={style}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg">{team.name}</CardTitle>
          <Badge 
            variant="secondary" 
            className="text-xs"
            style={{ backgroundColor: team.color + '20', color: team.color }}
          >
            {team.sport}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Budget Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Budget Used</span>
              <span className="text-white font-medium">
                {budgetPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${budgetPercentage}%`,
                  backgroundColor: team.color
                }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>₹{(spentBudget / 10000000).toFixed(1)}Cr spent</span>
              <span>₹{(team.remainingBudget / 10000000).toFixed(1)}Cr left</span>
            </div>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Users className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-lg font-bold text-white">
                  {team.players.length}
                </span>
              </div>
              <span className="text-xs text-gray-400">Players</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Trophy className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-lg font-bold text-white">
                  {team.players.filter(p => p.status === 'sold').length}
                </span>
              </div>
              <span className="text-xs text-gray-400">Sold</span>
            </div>
          </div>

          {/* Recent Players */}
          {team.players.length > 0 && (
            <div className="pt-2 border-t border-white/10">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Recent Acquisitions</h4>
              <div className="space-y-1">
                {team.players.slice(0, 2).map((player, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 truncate">{player.name}</span>
                    <span className="text-green-400">
                      ₹{((player.currentPrice || player.basePrice) / 100000).toFixed(1)}L
                    </span>
                  </div>
                ))}
                {team.players.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{team.players.length - 2} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
