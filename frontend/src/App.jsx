import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import BannerHeader from './components/BannerHeader'
import Home from './pages/home'
import Books from './pages/books'
import About from './pages/about'
import Library from './pages/Library'
import { LibraryProvider } from './context/LibraryContext'

// Create a wrapper component to use the navigate hook
function AppContent() {
  const navigate = useNavigate();
  
  const menuItems = [
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Books', onClick: () => navigate('/books') },
    { label: 'Library', onClick: () => navigate('/library') },
    { label: 'About', onClick: () => navigate('/about') }
  ];
  
  return (
    <>
      <BannerHeader 
        title="Digital Library"
        menuItems={menuItems}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/library" element={<Library />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <LibraryProvider>
        <AppContent />
      </LibraryProvider>
    </Router>
  );
}

export default App