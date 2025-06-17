import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Upload, Calendar, Users, Trophy, Settings, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Category } from '../types/models';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const AuctionSetup = () => {
  const [showForm, setShowForm] = useState(false);
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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: auctions = [], refetch } = useQuery({
    queryKey: ['auctions-list'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/auction/list');
        return res.data;
      } catch (error) {
        console.error('Error fetching auctions:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch auctions. Please try again.',
          variant: 'destructive',
        });
        return [];
      }
    },
    initialData: [],
  });

  const [editingAuctionId, setEditingAuctionId] = useState<string | null>(null);
  const navigate = useNavigate();

  const createAuctionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/auction', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions-list'] });
      setAuctionData({ title: '', date: '', totalTeams: '', maxBidAmount: '', rules: '' });
      setCategories([]);
      setTeamConstraints({ minPlayersPerTeam: '', maxPlayersPerTeam: '' });
      setEditingAuctionId(null);
      toast({ title: 'Auction Created', description: 'New auction has been set up successfully!' });
    },
    onError: (err: any) => {
      console.error('Error creating auction:', err);
      toast({ 
        title: 'Auction Creation Failed', 
        description: err.response?.data?.error || 'Something went wrong. Please try again.', 
        variant: 'destructive' 
      });
    },
  });

  const updateAuctionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const response = await axios.put(`/api/auction/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions-list'] });
      setAuctionData({ title: '', date: '', totalTeams: '', maxBidAmount: '', rules: '' });
      setCategories([]);
      setTeamConstraints({ minPlayersPerTeam: '', maxPlayersPerTeam: '' });
      setEditingAuctionId(null);
      toast({ title: 'Auction Updated', description: 'Auction updated successfully!' });
    },
    onError: (err: any) => {
      console.error('Error updating auction:', err);
      toast({ 
        title: 'Auction Update Failed', 
        description: err.response?.data?.error || 'Something went wrong. Please try again.', 
        variant: 'destructive' 
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
        title: "Error",
        description: "Please fill all required category fields.",
        variant: "destructive",
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
      title: "Category Added",
      description: `Category "${category.name}" has been added.`,
    });
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Button clicked - Form submission started');
    console.log('Current state:', {
      auctionData,
      categories,
      teamConstraints,
      editingAuctionId
    });
    
    // Validation: require all fields and at least one category
    if (!auctionData.title || !auctionData.date || !auctionData.totalTeams || !auctionData.maxBidAmount) {
      console.log('Validation failed - missing required fields');
      toast({
        title: 'Error',
        description: 'Please fill all required fields.',
        variant: 'destructive',
      });
      return;
    }
    if (categories.length === 0) {
      console.log('Validation failed - no categories');
      toast({
        title: 'Error',
        description: 'Please add at least one player category.',
        variant: 'destructive',
      });
      return;
    }

    // Prepare the data
    const data = {
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
      status: 'upcoming',
    };

    console.log('Attempting to submit data:', data);

    try {
      if (editingAuctionId) {
        console.log('Updating existing auction:', editingAuctionId);
        const result = await updateAuctionMutation.mutateAsync({ id: editingAuctionId, data });
        console.log('Update result:', result);
      } else {
        console.log('Creating new auction');
        const result = await createAuctionMutation.mutateAsync(data);
        console.log('Create result:', result);
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to save auction. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (auction: any) => {
    navigate(`/auction/edit/${auction._id || auction.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Auction Actions */}
      <Card className="bg-black/20 backdrop-blur-lg border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Auction Management
            </CardTitle>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-white text-black hover:bg-gray-100 hover:text-black"
            >
              Create New Auction
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Create/Edit Auction Form */}
      {showForm && (
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>{editingAuctionId ? 'Edit Auction' : 'Create New Auction'}</span>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={() => {
                  setShowForm(false);
                  setEditingAuctionId(null);
                  // Reset form data
                  setAuctionData({
                    title: '',
                    date: '',
                    totalTeams: '',
                    maxBidAmount: '',
                    rules: ''
                  });
                  setCategories([]);
                  setTeamConstraints({
                    minPlayersPerTeam: '',
                    maxPlayersPerTeam: ''
                  });
                }}
              >
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Auction Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Auction Title *</Label>
                  <Input
                    value={auctionData.title}
                    onChange={(e) => setAuctionData({...auctionData, title: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Premier Sports Auction 2024"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">Auction Date *</Label>
                  <Input
                    type="date"
                    value={auctionData.date}
                    onChange={(e) => setAuctionData({...auctionData, date: e.target.value})}
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
                    onChange={(e) => setAuctionData({...auctionData, totalTeams: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="8"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">Max Bid Points per Team (₹) *</Label>
                  <Input
                    type="number"
                    value={auctionData.maxBidAmount}
                    onChange={(e) => setAuctionData({...auctionData, maxBidAmount: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="50000000"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Auction Logo/Banner</Label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-400 mb-2">Upload auction logo or banner</p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="bg-white text-black hover:bg-gray-100 hover:text-black"
                  >
                    Choose File
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Auction Rules</Label>
                <Textarea
                  value={auctionData.rules}
                  onChange={(e) => setAuctionData({...auctionData, rules: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Enter auction rules and regulations..."
                  rows={4}
                />
              </div>

              {/* Team Constraints and Player Categories Section */}
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Team Constraints & Player Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Team Constraints */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Team Constraints
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Minimum Players per Team</Label>
                        <Input
                          placeholder="e.g., 11"
                          type="number"
                          value={teamConstraints.minPlayersPerTeam}
                          onChange={(e) => setTeamConstraints({...teamConstraints, minPlayersPerTeam: e.target.value})}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Maximum Players per Team</Label>
                        <Input
                          placeholder="e.g., 18"
                          type="number"
                          value={teamConstraints.maxPlayersPerTeam}
                          onChange={(e) => setTeamConstraints({...teamConstraints, maxPlayersPerTeam: e.target.value})}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Player Categories */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <Trophy className="h-5 w-5 mr-2" />
                      Player Categories
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        placeholder="Category name (e.g., A+)"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                      />
                      <Input
                        placeholder="Description"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                      />
                      <select
                        value={newCategory.color}
                        onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
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
                        onChange={(e) => setNewCategory({...newCategory, minAmount: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                      />
                      <Input
                        placeholder="Maximum Amount (₹)"
                        type="number"
                        value={newCategory.maxAmount}
                        onChange={(e) => setNewCategory({...newCategory, maxAmount: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                      />
                      <Input
                        placeholder="Bid Increment (₹)"
                        type="number"
                        value={newCategory.bidIncrement}
                        onChange={(e) => setNewCategory({...newCategory, bidIncrement: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>

                    <Button 
                      type="button"
                      onClick={addCategory}
                      className="bg-white text-black hover:bg-gray-100 hover:text-black"
                    >
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
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button 
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-100 hover:text-black"
              >
                {editingAuctionId ? 'Update Auction' : 'Create Auction'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Existing Auctions List */}
      <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Existing Auctions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {auctions.length === 0 ? (
            <p className="text-gray-400">No auctions created yet.</p>
          ) : (
            <div className="space-y-4">
              {auctions.map((auction: any) => {
                const auctionDate = new Date(auction.date);
                const now = new Date();
                const canEdit = auctionDate > now;
                return (
                  <div key={auction._id || auction.id} className="flex items-center justify-between bg-white/5 rounded p-3">
                    <div>
                      <div className="text-white font-bold">{auction.title}</div>
                      <div className="text-gray-400 text-sm">Date: {auction.date} | Teams: {auction.totalTeams} | Max Bid: ₹{auction.maxBidAmount}</div>
                    </div>
                    <Button
                      onClick={() => handleEdit(auction)}
                      disabled={!canEdit}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Edit
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
