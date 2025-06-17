
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, Upload, Check } from 'lucide-react';
import { auctionConfig } from '@/data/dummyData';
import { useToast } from '@/hooks/use-toast';

export const PlayerRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    sport: '',
    category: '',
    basePrice: '',
    experience: '',
    achievements: '',
    contact: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
      toast({
        title: "Registration Successful!",
        description: "Your registration has been submitted for review.",
      });
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sport: '',
      category: '',
      basePrice: '',
      experience: '',
      achievements: '',
      contact: '',
      email: ''
    });
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
            <p className="text-gray-300 mb-6">
              Thank you for registering! Our team will review your application and contact you soon.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={resetForm}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Register Another Player
              </Button>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                View Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Player Registration
          </h1>
          <p className="text-gray-300">
            Register yourself for the upcoming auction
          </p>
        </div>

        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <UserPlus className="h-5 w-5 mr-2" />
              Registration Form
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sport" className="text-white">Sport *</Label>
                  <select
                    id="sport"
                    value={formData.sport}
                    onChange={(e) => {
                      handleInputChange('sport', e.target.value);
                      handleInputChange('category', ''); // Reset category when sport changes
                    }}
                    className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white"
                    required
                  >
                    <option value="">Select a sport...</option>
                    {auctionConfig.sports.map(sport => (
                      <option key={sport} value={sport} className="bg-gray-800">
                        {sport}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white"
                    required
                    disabled={!formData.sport}
                  >
                    <option value="">Select a category...</option>
                    {formData.sport && auctionConfig.categories[formData.sport]?.map(category => (
                      <option key={category} value={category} className="bg-gray-800">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="basePrice" className="text-white">Expected Base Price (₹) *</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    placeholder="e.g., 500000"
                    value={formData.basePrice}
                    onChange={(e) => handleInputChange('basePrice', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact" className="text-white">Contact Number *</Label>
                  <Input
                    id="contact"
                    type="tel"
                    placeholder="Enter your contact number"
                    value={formData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className="text-white">Experience (Years)</Label>
                <Input
                  id="experience"
                  type="number"
                  placeholder="Years of experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="achievements" className="text-white">Achievements & Records</Label>
                <Textarea
                  id="achievements"
                  placeholder="List your major achievements, records, or notable performances..."
                  value={formData.achievements}
                  onChange={(e) => handleInputChange('achievements', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[100px]"
                />
              </div>

              {/* Profile Picture Upload */}
              <div className="space-y-2">
                <Label className="text-white">Profile Picture (Optional)</Label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-400 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                  <Button type="button" variant="outline" className="mt-2 border-white/20 text-white hover:bg-white/10">
                    Choose File
                  </Button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 rounded border-white/20 bg-white/10"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-300">
                  I agree to the <span className="text-blue-400 cursor-pointer">terms and conditions</span> and 
                  understand that my registration is subject to verification and approval by the auction committee.
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
