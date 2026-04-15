import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiUrl } from '../services/api';

const LibraryContext = createContext();

export const SHELVES = ['Want to Read', 'Currently Reading', 'Finished Reading'];

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used within LibraryProvider');
  return context;
};

export const LibraryProvider = ({ children }) => {
  const { user, authFetch } = useAuth();
  const [library, setLibrary] = useState([]);
  const [libraryLoading, setLibraryLoading] = useState(false);

  // Reload library whenever the logged-in user changes
  useEffect(() => {
    if (!user) {
      setLibrary([]);
      return;
    }
    setLibraryLoading(true);
    authFetch(apiUrl('/api/library'))
      .then((res) => res.json())
      .then((data) => setLibrary(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLibraryLoading(false));
  }, [user]);

  const addToLibrary = async (book, status = 'want-to-read') => {
    try {
      const res = await authFetch(apiUrl('/api/library'), {
        method: 'POST',
        body: JSON.stringify({ book, status }),
      });
      const data = await res.json();
        if (!res.ok) { alert(data.message); return; }
          setLibrary((prev) => [{ ...book, status, addedAt: new Date() }, ...prev]);
          alert(data.message);
        } catch (err) {
          alert('Failed to add book. Please try again.');
          console.error(err);
        }
      };

  const removeFromLibrary = async (bookId) => {
    try {
      await authFetch(apiUrl(`/api/library/${bookId}`), { method: 'DELETE' });
      setLibrary((prev) => prev.filter((b) => b.id !== bookId && b._id !== bookId));
    } catch (err) {
      alert('Failed to remove book. Please try again.');
      console.error(err);
    }
  };

  const moveToShelf = async (bookId, shelf) => {
    try {
      await authFetch(apiUrl(`/api/library/${bookId}/shelf`), {
        method: 'PATCH',
        body: JSON.stringify({ shelf }),
      });
      setLibrary((prev) =>
        prev.map((b) =>
          b.id === bookId || b._id === bookId ? { ...b, shelf } : b
        )
      );
    } catch (err) {
      alert('Failed to move book. Please try again.');
      console.error(err);
    }
  };

  const saveNotes = async (bookId, notes) => {
    try {
      await authFetch(apiUrl(`/api/library/${bookId}/notes`), {
        method: 'PATCH',
        body: JSON.stringify({ notes }),
      });
      setLibrary((prev) =>
        prev.map((b) =>
          b.id === bookId || b._id === bookId ? { ...b, notes } : b
        )
      );
    } catch (err) {
      alert('Failed to save notes.');
      console.error(err);
    }
  };

  const updateStatus = async (bookId, status) => {
    try {
      await authFetch(apiUrl(`/api/library/${bookId}/status`), {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setLibrary((prev) =>
        prev.map((b) =>
          (b.id === bookId || b._id === bookId) ? { ...b, status } : b
        )
      );
    } catch (err) {
      alert('Failed to update status.');
      console.error(err);
    }
  };

  const isInLibrary = (bookId) =>
    library.some((b) => b.id === bookId || b._id === bookId);

  const getShelfForBook = (bookId) => {
    const book = library.find((b) => b.id === bookId || b._id === bookId);
    return book?.shelf ?? null;
  };

  const clearLibrary = async () => {
    if (!window.confirm('Are you sure you want to clear your entire library?')) return;
    try {
      await Promise.all(
        library.map((b) =>
          authFetch(apiUrl(`/api/library/${b.id || b._id}`), { method: 'DELETE' })
        )
      );
      setLibrary([]);
    } catch (err) {
      alert('Failed to clear library.');
      console.error(err);
    }
  };

  return (
    <LibraryContext.Provider
      value = {{ library, libraryLoading, addToLibrary, removeFromLibrary, isInLibrary, clearLibrary, saveNotes, updateStatus }}
    >
      {children}
    </LibraryContext.Provider>
  );
};