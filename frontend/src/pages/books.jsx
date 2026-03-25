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
  const [addingId, setAddingId] = useState(null);

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

  const openModal  = (book) => setSelectedBook(book);
  const closeModal = ()     => setSelectedBook(null);

  return (
    <div className="page-container">
      <h2>Books</h2>
      <p style={{ color: 'var(--text-muted)' }}>Search and browse our collection of books.</p>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {/* ── Status messages ── */}
      {loading && (
        <p style={{ textAlign: 'center', color: 'var(--accent)', padding: 'var(--space-xl)' }}>
          Searching for books…
        </p>
      )}

      {error && !loading && (
        <p style={{ textAlign: 'center', color: 'var(--danger)', padding: 'var(--space-xl)' }}>
          {error}
        </p>
      )}

      {!loading && !error && books.length === 0 && !hasSearched && (
        <p className="empty-state">Use the search bar above to find books!</p>
      )}

      {/* ── Book list ── */}
      {!loading && books.length > 0 && (
        <ul className="book-list">
          {books.map((book) => {
            const inLibrary = isInLibrary(book.id);
            const isAdding  = addingId === book.id;
            return (
              <li
                key={book.id}
                className="book-item"
                onClick={() => openModal(book)}
              >
                {book.thumbnail && (
                  <img
                    src={book.thumbnail}
                    alt={book.title}
                    className="book-thumbnail"
                  />
                )}
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-meta">{book.author} • {book.year}</p>
                  <button
                    className={`btn-add${inLibrary ? ' in-library' : ''}`}
                    disabled={inLibrary || isAdding}
                    onClick={(e) => { e.stopPropagation(); handleAddToLibrary(book); }}
                  >
                    {inLibrary ? '✓ In Library' : isAdding ? 'Adding…' : '+ Add to Library'}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* ── Book detail modal ── */}
      {selectedBook && (() => {
        const inLibrary = isInLibrary(selectedBook.id);
        const isAdding  = addingId === selectedBook.id;
        return (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">{selectedBook.title}</h2>

              <p className="modal-meta"><strong>Author:</strong> {selectedBook.author}</p>
              <p className="modal-meta"><strong>Year:</strong> {selectedBook.year}</p>
              {selectedBook.publisher && (
                <p className="modal-meta"><strong>Publisher:</strong> {selectedBook.publisher}</p>
              )}
              {selectedBook.pageCount && (
                <p className="modal-meta"><strong>Pages:</strong> {selectedBook.pageCount}</p>
              )}

              <p className="modal-description">
                <strong>Description:</strong>{' '}
                {selectedBook.description || 'No description available.'}
              </p>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={closeModal}>
                  Close
                </button>
                <button
                  className={`btn-add${inLibrary ? ' in-library' : ''}`}
                  disabled={inLibrary || isAdding}
                  onClick={() => handleAddToLibrary(selectedBook)}
                >
                  {inLibrary ? '✓ In Library' : isAdding ? 'Adding…' : '+ Add to Library'}
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