
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Upload, Calendar, Users, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Category } from '@/data/auctionData';

export const AuctionSetup = () => {
  const [auctionData, setAuctionData] = useState({
    title: '',
    date: '',
    totalTeams: '',
    maxBidAmount: '',
    rules: ''
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', color: 'bg-blue-500' });
  const { toast } = useToast();

  const colorOptions = [
    'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500',
    'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
  ];

  const addCategory = () => {
    if (!newCategory.name) return;
    
    const category: Category = {
      id: Date.now().toString(),
      ...newCategory
    };
    
    setCategories([...categories, category]);
    setNewCategory({ name: '', description: '', color: 'bg-blue-500' });
    
    toast({
      title: "Category Added",
      description: `Category "${category.name}" has been added.`,
    });
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Auction Created",
      description: "New auction has been set up successfully!",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/20 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Create New Auction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label className="text-white">Max Bid Amount per Team (₹) *</Label>
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
                <Button type="button" variant="outline" className="border-white/20 text-white">
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
          </form>
        </CardContent>
      </Card>

      {/* Categories Management */}
      <Card className="bg-black/20 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Player Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <div className="flex gap-2">
              <select
                value={newCategory.color}
                onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                className="flex-1 px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white"
              >
                {colorOptions.map(color => (
                  <option key={color} value={color} className="bg-gray-800">
                    {color.replace('bg-', '').replace('-500', '')}
                  </option>
                ))}
              </select>
              <Button onClick={addCategory} size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <div key={category.id} className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
                <Badge className={`${category.color} text-white`}>
                  {category.name}
                </Badge>
                <span className="text-sm text-gray-300">{category.description}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeCategory(category.id)}
                  className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
            Create Auction
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
