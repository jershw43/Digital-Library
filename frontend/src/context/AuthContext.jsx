import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Decode JWT payload without verifying signature (verification happens on the server)
const getTokenExpiry = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // convert to ms
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (token && username) {
      const expiry = getTokenExpiry(token);
      if (expiry && Date.now() < expiry) {
        // Token is still valid
        setUser({ token, username });
      } else {
        // Token is expired — clear it so user gets redirected to login
        localStorage.removeItem('token');
        localStorage.removeItem('username');
      }
    }
    setLoading(false);
  }, []);

  const login = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setUser({ token, username });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  const authFetch = (url, options = {}) => {
    const { headers, ...rest } = options;
    return fetch(url, {
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
