import React, { createContext, useState, useContext, useEffect } from 'react';

const LibraryContext = createContext();

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within LibraryProvider');
  }
  return context;
};

export const LibraryProvider = ({ children }) => {
  const [library, setLibrary] = useState(() => {
    // Load from localStorage on init
    const saved = localStorage.getItem('digitalLibrary');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever library changes
  useEffect(() => {
    localStorage.setItem('digitalLibrary', JSON.stringify(library));
  }, [library]);

  const addToLibrary = (book) => {
    setLibrary((prev) => {
      // Prevent duplicates
      if (prev.find((b) => b.id === book.id)) {
        alert('This book is already in your library!');
        return prev;
      }
      alert(`"${book.title}" has been added to your library!`);
      return [...prev, book];
    });
  };

  const removeFromLibrary = (bookId) => {
    setLibrary((prev) => prev.filter((book) => book.id !== bookId));
  };

  const isInLibrary = (bookId) => {
    return library.some((book) => book.id === bookId);
  };

  const clearLibrary = () => {
    if (window.confirm('Are you sure you want to clear your entire library?')) {
      setLibrary([]);
    }
  };

  return (
    <LibraryContext.Provider value={{ 
      library, 
      addToLibrary, 
      removeFromLibrary, 
      isInLibrary,
      clearLibrary 
    }}>
      {children}
    </LibraryContext.Provider>
  );
};