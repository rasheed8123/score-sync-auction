
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from '@/components/Dashboard';
import { AdminPanel } from '@/components/AdminPanel';
import { PlayerRegistration } from '@/components/PlayerRegistration';
import { Login } from '@/components/Login';
import { Navbar } from '@/components/Navbar';
import { useState } from 'react';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Router>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/register" element={<PlayerRegistration />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/admin" element={isLoggedIn ? <AdminPanel /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
      </Router>
    </div>
  );
};

export default Index;
