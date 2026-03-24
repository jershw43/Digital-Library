import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchBooks } from '../services/googleBooksAPI';
import SearchBar from '../components/SearchBar';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [addingId, setAddingId] = useState(null); // tracks which book is being added

  const { addToLibrary, isInLibrary } = useLibrary();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const results = await searchBooks(query);
      setBooks(results);
      if (results.length === 0) setError('No books found. Try a different search term.');
    } catch {
      setError('Failed to fetch books. Please try again.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToLibrary = async (book) => {
    if (!user) {
      navigate('/login', { state: { from: '/books' } });
      return;
    }
    setAddingId(book.id);
    await addToLibrary(book);
    setAddingId(null);
  };

  const openModal = (book) => setSelectedBook(book);
  const closeModal = () => setSelectedBook(null);

  // ── Styles ──────────────────────────────────────────────────────────────────

  const containerStyle = { marginTop: '100px', padding: '20px' };

  const listStyle = {
    listStyleType: 'none', padding: '0',
    maxWidth: '800px', margin: '20px auto',
  };

  const bookItemStyle = {
    padding: '15px', marginBottom: '10px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '8px',
    boxShadow: '0 2px 4px var(--shadow)',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex', gap: '15px',
  };

  const thumbnailStyle = {
    width: '80px', height: '120px', objectFit: 'cover',
    borderRadius: '4px', backgroundColor: 'var(--border)',
    flexShrink: 0,
  };

  const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000,
  };

  const modalContentStyle = {
    backgroundColor: 'var(--surface)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    padding: '30px', borderRadius: '12px',
    maxWidth: '600px', width: '90%',
    maxHeight: '80vh', overflowY: 'auto',
    boxShadow: '0 8px 16px var(--shadow)',
  };

  const addBtnStyle = (inLibrary, isAdding) => ({
    backgroundColor: inLibrary ? '#28a745' : 'var(--accent)',
    color: '#fff', border: 'none',
    padding: '10px 20px', borderRadius: '5px',
    cursor: inLibrary || isAdding ? 'default' : 'pointer',
    fontSize: '1rem', opacity: isAdding ? 0.7 : 1,
    transition: 'background-color 0.2s',
  });

  const closeBtnStyle = {
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    padding: '10px 20px', borderRadius: '5px', cursor: 'pointer',
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div style={containerStyle}>
      <h2>Books</h2>
      <p style={{ color: 'var(--text-muted)' }}>Search and browse our collection of books.</p>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {loading && (
        <p style={{ textAlign: 'center', color: 'var(--accent)', padding: '40px' }}>
          Searching for books...
        </p>
      )}

      {error && !loading && (
        <p style={{ textAlign: 'center', color: 'var(--danger)', padding: '40px' }}>{error}</p>
      )}

      {!loading && !error && books.length === 0 && !hasSearched && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
          Use the search bar above to find books!
        </p>
      )}

      {!loading && books.length > 0 && (
        <ul style={listStyle}>
          {books.map((book) => {
            const inLibrary = isInLibrary(book.id);
            return (
              <li
                key={book.id}
                style={bookItemStyle}
                onClick={() => openModal(book)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px var(--shadow)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px var(--shadow)';
                }}
              >
                {book.thumbnail && (
                  <img src={book.thumbnail} alt={book.title} style={thumbnailStyle} />
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0', color: 'var(--text)' }}>{book.title}</h3>
                  <p style={{ margin: '0 0 10px', color: 'var(--text-muted)' }}>
                    {book.author} • {book.year}
                  </p>
                  {/* Quick-add button right on the list item */}
                  <button
                    style={addBtnStyle(inLibrary, addingId === book.id)}
                    disabled={inLibrary || addingId === book.id}
                    onClick={(e) => { e.stopPropagation(); handleAddToLibrary(book); }}
                  >
                    {inLibrary ? '✓ In Library' : addingId === book.id ? 'Adding...' : '+ Add to Library'}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Modal */}
      {selectedBook && (() => {
        const inLibrary = isInLibrary(selectedBook.id);
        const isAdding = addingId === selectedBook.id;
        return (
          <div style={modalOverlayStyle} onClick={closeModal}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ marginTop: 0, color: 'var(--accent)' }}>{selectedBook.title}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>
                <strong>Author:</strong> {selectedBook.author}
              </p>
              <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>
                <strong>Year:</strong> {selectedBook.year}
              </p>
              {selectedBook.publisher && (
                <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>
                  <strong>Publisher:</strong> {selectedBook.publisher}
                </p>
              )}
              {selectedBook.pageCount && (
                <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>
                  <strong>Pages:</strong> {selectedBook.pageCount}
                </p>
              )}
              <div style={{ lineHeight: '1.6', marginBottom: '20px' }}>
                <strong>Description:</strong>
                <p style={{ color: 'var(--text-muted)' }}>
                  {selectedBook.description || 'No description available.'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button style={closeBtnStyle} onClick={closeModal}>Close</button>
                <button
                  style={addBtnStyle(inLibrary, isAdding)}
                  disabled={inLibrary || isAdding}
                  onClick={() => handleAddToLibrary(selectedBook)}
                >
                  {inLibrary ? '✓ In Library' : isAdding ? 'Adding...' : '+ Add to Library'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default Books;