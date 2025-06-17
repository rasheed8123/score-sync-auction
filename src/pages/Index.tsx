import { Routes, Route } from 'react-router-dom';
import { Dashboard } from '@/components/Dashboard';
import { AdminPanel } from '@/components/AdminPanel';
import { PlayerRegistration } from '@/components/PlayerRegistration';
import { Login } from '@/components/Login';
import { Navbar } from '@/components/Navbar';
import OverlayPage from '@/pages/OverlayPage';
import { useState, useEffect } from 'react';
import { AuctionEdit } from '@/components/AuctionEdit';
import axios from 'axios';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Routes>
        <Route path="/overlay" element={<OverlayPage />} />
        <Route path="/*" element={
          <>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/register" element={<PlayerRegistration />} />
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/admin" element={isLoggedIn ? <AdminPanel /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/auction/edit/:id" element={<AuctionEdit />} />
            </Routes>
          </>
        } />
      </Routes>
    </div>
  );
};

export default Index;
