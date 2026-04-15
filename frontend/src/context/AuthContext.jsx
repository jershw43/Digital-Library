import { createContext, useState, useContext, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';
console.log('VITE_API_URL =', import.meta.env.VITE_API_URL);
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const getTokenExpiry = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      const { value: token } = await Preferences.get({ key: 'token' });
      const { value: username } = await Preferences.get({ key: 'username' });

      if (token && username) {
        const expiry = getTokenExpiry(token);
        if (expiry && Date.now() < expiry) {
          setUser({ token, username });
        } else {
          await Preferences.remove({ key: 'token' });
          await Preferences.remove({ key: 'username' });
        }
      }
      setLoading(false);
    };

    loadAuth();
  }, []);

  const login = async (token, username) => {
    await Preferences.set({ key: 'token', value: token });
    await Preferences.set({ key: 'username', value: username });
    setUser({ token, username });
  };

  const logout = async () => {
    await Preferences.remove({ key: 'token' });
    await Preferences.remove({ key: 'username' });
    setUser(null);
  };

  const authFetch = (url, options = {}) => {
  const base = import.meta.env.VITE_API_URL || '';
  return fetch(`${base}${url}`, {   // url already starts with /api/...
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(user?.token && { Authorization: `Bearer ${user.token}` }),
      ...options.headers,
    },
  });
};

  return (
    <AuthContext.Provider value={{ user, login, logout, authFetch, loading }}>
      {children}
    </AuthContext.Provider>
  );
};