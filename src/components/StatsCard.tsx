
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend: string;
  className?: string;
}

export const StatsCard = ({ title, value, icon: Icon, trend, className }: StatsCardProps) => {
  const isPositive = trend.startsWith('+');
  const isNeutral = trend === '0%';

  return (
    <Card className={`bg-black/20 backdrop-blur-lg border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className={`text-xs ${
              isPositive ? 'text-green-400' : 
              isNeutral ? 'text-gray-400' : 'text-red-400'
            }`}>
              {trend} from last week
            </p>
          </div>
          <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
