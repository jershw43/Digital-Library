import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import BannerHeader from './components/BannerHeader';
import Home from './pages/home';
import About from './pages/about';
import Library from './pages/Library';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import { LibraryProvider } from './context/LibraryContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Library', onClick: () => navigate('/library') },
    { label: 'About', onClick: () => navigate('/about') },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <BannerHeader
        title="Digital Library"
        menuItems={menuItems}
        user={user}
        onLogout={handleLogout}
        onLogin={() => navigate('/login')}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <LibraryProvider>
          <AppContent />
        </LibraryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;