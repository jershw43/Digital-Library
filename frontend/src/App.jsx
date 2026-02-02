import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import BannerHeader from './components/BannerHeader'
import Home from './pages/Home'
import Books from './pages/Books'
import About from './pages/About'

// Create a wrapper component to use the navigate hook
function AppContent() {
  const navigate = useNavigate();
  
  const menuItems = [
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Books', onClick: () => navigate('/books') },
    { label: 'About', onClick: () => navigate('/about') }
  ];
  
  return (
    <>
      <BannerHeader 
        title="Welcome to the Digital Library"
        menuItems={menuItems}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App
