
import { useState, useEffect } from 'react';
import { Search, Filter, Trophy, Users, DollarSign, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dummyPlayers, dummyTeams, type Player, type Team } from '@/data/dummyData';
import { PlayerCard } from '@/components/PlayerCard';
import { TeamCard } from '@/components/TeamCard';
import { StatsCard } from '@/components/StatsCard';
import gsap from 'gsap';

export const Dashboard = () => {
  const [players] = useState<Player[]>(dummyPlayers);
  const [teams] = useState<Team[]>(dummyTeams);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeTab, setActiveTab] = useState<'players' | 'teams'>('players');

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport === 'All' || player.sport === selectedSport;
    const matchesStatus = selectedStatus === 'All' || player.status === selectedStatus;
    return matchesSearch && matchesSport && matchesStatus;
  });

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport === 'All' || team.sport === selectedSport;
    return matchesSearch && matchesSport;
  });

  const sports = ['All', ...Array.from(new Set(players.map(p => p.sport)))];
  const statuses = ['All', 'sold', 'unsold', 'bidding', 'yet-to-auction'];

  const stats = {
    totalPlayers: players.length,
    soldPlayers: players.filter(p => p.status === 'sold').length,
    totalTeams: teams.length,
    totalValue: players.filter(p => p.currentPrice).reduce((sum, p) => sum + (p.currentPrice || 0), 0)
  };

  useEffect(() => {
    // Animate cards on load
    gsap.fromTo(
      '.animate-card',
      { opacity: 0, y: 50, scale: 0.9 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: "power3.out" 
      }
    );
  }, [activeTab, filteredPlayers, filteredTeams]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Live Auction Dashboard
          </h1>
          <p className="text-gray-300">
            Real-time updates from the auction floor
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Players"
            value={stats.totalPlayers}
            icon={Users}
            trend="+12%"
            className="animate-card"
          />
          <StatsCard
            title="Players Sold"
            value={stats.soldPlayers}
            icon={Trophy}
            trend="+8%"
            className="animate-card"
          />
          <StatsCard
            title="Active Teams"
            value={stats.totalTeams}
            icon={Users}
            trend="0%"
            className="animate-card"
          />
          <StatsCard
            title="Total Value"
            value={`₹${(stats.totalValue / 10000000).toFixed(1)}Cr`}
            icon={DollarSign}
            trend="+25%"
            className="animate-card"
          />
        </div>

        {/* Filters */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-8 animate-card">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search players or teams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white text-sm"
                >
                  {sports.map(sport => (
                    <option key={sport} value={sport} className="bg-gray-800">
                      {sport}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white text-sm"
                >
                  {statuses.map(status => (
                    <option key={status} value={status} className="bg-gray-800">
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <Button
            onClick={() => setActiveTab('players')}
            variant={activeTab === 'players' ? 'default' : 'outline'}
            className={`${
              activeTab === 'players' 
                ? 'bg-white text-black' 
                : 'bg-transparent border-white/20 text-white hover:bg-white/10'
            }`}
          >
            Players ({filteredPlayers.length})
          </Button>
          <Button
            onClick={() => setActiveTab('teams')}
            variant={activeTab === 'teams' ? 'default' : 'outline'}
            className={`${
              activeTab === 'teams' 
                ? 'bg-white text-black' 
                : 'bg-transparent border-white/20 text-white hover:bg-white/10'
            }`}
          >
            Teams ({filteredTeams.length})
          </Button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'players' ? (
            filteredPlayers.map((player, index) => (
              <PlayerCard
                key={player.id}
                player={player}
                className="animate-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))
          ) : (
            filteredTeams.map((team, index) => (
              <TeamCard
                key={team.id}
                team={team}
                className="animate-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))
          )}
        </div>

        {/* Empty State */}
        {((activeTab === 'players' && filteredPlayers.length === 0) || 
          (activeTab === 'teams' && filteredTeams.length === 0)) && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
