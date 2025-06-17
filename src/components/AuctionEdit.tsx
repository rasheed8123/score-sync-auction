import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Upload, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { type Category } from '../types/models';

export const AuctionEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [auctionData, setAuctionData] = useState({
    title: '',
    date: '',
    totalTeams: '',
    maxBidAmount: '',
    rules: ''
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [teamConstraints, setTeamConstraints] = useState({
    minPlayersPerTeam: '',
    maxPlayersPerTeam: ''
  });
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: 'bg-blue-500',
    minAmount: '',
    maxAmount: '',
    bidIncrement: ''
  });

  // Fetch auction data
  const { data, isLoading } = useQuery({
    queryKey: ['auction', id],
    queryFn: async () => {
      const res = await axios.get(`/api/auction/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      setAuctionData({
        title: data.title,
        date: data.date,
        totalTeams: data.totalTeams.toString(),
        maxBidAmount: data.maxBidAmount.toString(),
        rules: data.rules || '',
      });
      setCategories(data.categories || []);
      // Optionally set team constraints if stored in auction
    }
  }, [data]);

  const updateAuctionMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await axios.put(`/api/auction/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      toast({ title: 'Auction Updated', description: 'Auction updated successfully!' });
      navigate('/');
    },
    onError: (err: any) => {
      toast({
        title: 'Auction Update Failed',
        description: err.response?.data?.error || 'Something went wrong.',
        variant: 'destructive',
      });
    },
  });

  const colorOptions = [
    'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500',
    'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
  ];

  const addCategory = () => {
    if (!newCategory.name || !newCategory.minAmount || !newCategory.maxAmount) {
      toast({
        title: 'Error',
        description: 'Please fill all required category fields.',
        variant: 'destructive',
      });
      return;
    }
    const category: Category = {
      id: Date.now().toString(),
      name: newCategory.name,
      description: newCategory.description,
      color: newCategory.color,
      minAmount: Number(newCategory.minAmount),
      maxAmount: Number(newCategory.maxAmount),
      bidIncrement: Number(newCategory.bidIncrement),
      minPlayersPerTeam: Number(teamConstraints.minPlayersPerTeam) || 0,
      maxPlayersPerTeam: Number(teamConstraints.maxPlayersPerTeam) || 99
    };
    setCategories([...categories, category]);
    setNewCategory({
      name: '',
      description: '',
      color: 'bg-blue-500',
      minAmount: '',
      maxAmount: '',
      bidIncrement: ''
    });
    toast({
      title: 'Category Added',
      description: `Category "${category.name}" has been added.`,
    });
  };

  const removeCategory = (catId: string) => {
    setCategories(categories.filter(cat => cat.id !== catId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auctionData.title || !auctionData.date || !auctionData.totalTeams || !auctionData.maxBidAmount) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields.',
        variant: 'destructive',
      });
      return;
    }
    if (categories.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one player category.',
        variant: 'destructive',
      });
      return;
    }
    const payload = {
      ...auctionData,
      categories: categories.map(cat => ({
        ...cat,
        minAmount: Number(cat.minAmount),
        maxAmount: Number(cat.maxAmount),
        bidIncrement: Number(cat.bidIncrement),
        minPlayersPerTeam: Number(teamConstraints.minPlayersPerTeam) || 0,
        maxPlayersPerTeam: Number(teamConstraints.maxPlayersPerTeam) || 99
      })),
      totalTeams: Number(auctionData.totalTeams),
      maxBidAmount: Number(auctionData.maxBidAmount),
      status: data.status || 'upcoming',
    };
    updateAuctionMutation.mutate(payload);
  };

  if (isLoading) return <div className="text-white">Loading...</div>;

  return (
    <div className="space-y-6">
      <Card className="bg-black/20 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            Edit Auction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Auction Title *</Label>
                <Input
                  value={auctionData.title}
                  onChange={e => setAuctionData({ ...auctionData, title: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Auction Date *</Label>
                <Input
                  type="date"
                  value={auctionData.date}
                  onChange={e => setAuctionData({ ...auctionData, date: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Total Teams *</Label>
                <Input
                  type="number"
                  value={auctionData.totalTeams}
                  onChange={e => setAuctionData({ ...auctionData, totalTeams: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Max Bid Points per Team (₹) *</Label>
                <Input
                  type="number"
                  value={auctionData.maxBidAmount}
                  onChange={e => setAuctionData({ ...auctionData, maxBidAmount: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Auction Rules</Label>
              <Textarea
                value={auctionData.rules}
                onChange={e => setAuctionData({ ...auctionData, rules: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                rows={4}
              />
            </div>
          </form>
        </CardContent>
      </Card>
      {/* Player Categories */}
      <Card className="bg-black/20 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Player Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Category name (e.g., A+)"
              value={newCategory.name}
              onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
            />
            <Input
              placeholder="Description"
              value={newCategory.description}
              onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
            />
            <select
              value={newCategory.color}
              onChange={e => setNewCategory({ ...newCategory, color: e.target.value })}
              className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white"
            >
              {colorOptions.map(color => (
                <option key={color} value={color} className="bg-gray-800">
                  {color.replace('bg-', '').replace('-500', '')}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Minimum Amount (₹)"
              type="number"
              value={newCategory.minAmount}
              onChange={e => setNewCategory({ ...newCategory, minAmount: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
            />
            <Input
              placeholder="Maximum Amount (₹)"
              type="number"
              value={newCategory.maxAmount}
              onChange={e => setNewCategory({ ...newCategory, maxAmount: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
            />
            <Input
              placeholder="Bid Increment (₹)"
              type="number"
              value={newCategory.bidIncrement}
              onChange={e => setNewCategory({ ...newCategory, bidIncrement: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          <Button onClick={addCategory} className="w-full bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
          {/* Category List */}
          <div className="space-y-3">
            {categories.map(category => (
              <div key={category.id} className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Badge className={`${category.color} text-white`}>
                      {category.name}
                    </Badge>
                    <span className="text-sm text-gray-300">{category.description}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeCategory(category.id)}
                    className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-400">
                  <div>Min: ₹{(category.minAmount / 100000).toFixed(1)}L</div>
                  <div>Max: ₹{(category.maxAmount / 100000).toFixed(1)}L</div>
                  <div>Increment: ₹{(category.bidIncrement / 100000).toFixed(1)}L</div>
                </div>
              </div>
            ))}
          </div>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            disabled={
              updateAuctionMutation.status === 'pending' ||
              !auctionData.title ||
              !auctionData.date ||
              !auctionData.totalTeams ||
              !auctionData.maxBidAmount ||
              categories.length === 0
            }
          >
            {updateAuctionMutation.status === 'pending' ? 'Updating...' : 'Update Auction'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuctionEdit; 