import { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// React Native safe JWT decoder
const getTokenExpiry = (token) => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    const payload = JSON.parse(
      decodeURIComponent(
        atob(padded).split('').map(c =>
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join('')
      )
    );
    return payload.exp * 1000;
  } catch {
    return null;
  }
};

export const API_BASE = 'http://Y10.2.37.58:5001';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token    = await AsyncStorage.getItem('token');
        const username = await AsyncStorage.getItem('username');
        if (token && username) {
          const expiry = getTokenExpiry(token);
          if (expiry && Date.now() < expiry) {
            setUser({ token, username });
          } else {
            await AsyncStorage.multiRemove(['token', 'username']);
          }
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (token, username) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('username', username);
    setUser({ token, username });
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'username']);
    setUser(null);
  };

  const authFetch = (path, options = {}) => {
    const { headers, ...rest } = options;
    return fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...(user?.token && { Authorization: `Bearer ${user.token}` }),
        ...headers,
      },
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authFetch, loading }}>
      {children}
    </AuthContext.Provider>
  );
};