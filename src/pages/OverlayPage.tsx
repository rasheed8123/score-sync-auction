import { OverlayScreen } from '@/components/OverlayScreen';

const OverlayPage = () => {
  return (
    <div className="min-h-screen">
      {/* TODO: Fetch real auction data and pass to OverlayScreen */}
      <OverlayScreen 
        currentPlayer={null}
        currentBid={null}
        highlights={[]}
        auctionTitle=""
      />
    </div>
  );
};

export default OverlayPage;
