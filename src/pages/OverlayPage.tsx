
import { OverlayScreen } from '@/components/OverlayScreen';

const OverlayPage = () => {
  // Mock data - in real app, this would come from auction context/state
  const mockPlayer = {
    id: '1',
    name: 'Rajesh Kumar',
    sport: 'Cricket',
    category: 'A+',
    basePrice: 2000000,
    status: 'bidding' as const
  };

  const mockBid = {
    id: '1',
    playerId: '1',
    teamName: 'Mumbai Warriors',
    amount: 3200000,
    timestamp: new Date(),
    auctionId: '1'
  };

  const highlights = [
    "Rajesh Kumar sold to Mumbai Warriors for ₹3.2L",
    "Intense bidding war for Priya Sharma between 3 teams!",
    "Chennai Challengers leading with aggressive bids",
    "Football auction starts next with exciting young talents"
  ];

  return (
    <div className="min-h-screen">
      <OverlayScreen 
        currentPlayer={mockPlayer}
        currentBid={mockBid}
        highlights={highlights}
        auctionTitle="Premier Sports Auction 2024"
      />
    </div>
  );
};

export default OverlayPage;
