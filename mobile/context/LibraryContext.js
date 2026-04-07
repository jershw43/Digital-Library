import { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './AuthContext';

const LibraryContext = createContext();

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used within LibraryProvider');
  return context;
};

export const LibraryProvider = ({ children }) => {
  const { user, authFetch } = useAuth();
  const [library, setLibrary]               = useState([]);
  const [libraryLoading, setLibraryLoading] = useState(false);

  useEffect(() => {
    if (!user) { setLibrary([]); return; }
    setLibraryLoading(true);
    authFetch('/api/library')
      .then(res => res.json())
      .then(data => setLibrary(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLibraryLoading(false));
  }, [user]);

  const addToLibrary = async (book) => {
    try {
      const res  = await authFetch('/api/library', {
        method: 'POST',
        body: JSON.stringify({ book }),
      });
      const data = await res.json();
      if (!res.ok) { Alert.alert('Notice', data.message); return; }
      setLibrary(prev => [{ ...book, addedAt: new Date() }, ...prev]);
      Alert.alert('Added!', data.message);
    } catch {
      Alert.alert('Error', 'Failed to add book. Please try again.');
    }
  };

  const removeFromLibrary = async (bookId) => {
    try {
      await authFetch(`/api/library/${bookId}`, { method: 'DELETE' });
      setLibrary(prev => prev.filter(b => b.id !== bookId && b._id !== bookId));
    } catch {
      Alert.alert('Error', 'Failed to remove book. Please try again.');
    }
  };

  const isInLibrary = (bookId) =>
    library.some(b => b.id === bookId || b._id === bookId);

  const clearLibrary = () => {
    Alert.alert(
      'Clear Library',
      'Are you sure you want to clear your entire library?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear', style: 'destructive',
          onPress: async () => {
            try {
              await Promise.all(
                library.map(b =>
                  authFetch(`/api/library/${b.id || b._id}`, { method: 'DELETE' })
                )
              );
              setLibrary([]);
            } catch {
              Alert.alert('Error', 'Failed to clear library.');
            }
          },
        },
      ]
    );
  };

  return (
    <LibraryContext.Provider
      value={{ library, libraryLoading, addToLibrary, removeFromLibrary, isInLibrary, clearLibrary }}
    >
      {children}
    </LibraryContext.Provider>
  );
};