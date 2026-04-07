import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';

const Library = () => {
  const { library, removeFromLibrary, clearLibrary, saveNotes } = useLibrary();
  const [selectedBook, setSelectedBook] = useState(null);
  const [notes, setNotes] = useState('');

  const openModal = (book) => {
    setSelectedBook(book);
    setNotes(book.notes || '');
  };
  const closeModal = ()     => setSelectedBook(null);

  const handleRemove = (book) => {
    if (window.confirm(`Remove "${book.title}" from your library?`)) {
      removeFromLibrary(book.id);
      closeModal();
    }
  };

  return (
    <div className="page-container">

      {/* ── Page header ── */}
      <div className="library-header">
        <div>
          <h2>My Library</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            Your personal collection of saved books
          </p>
        </div>

        {library.length > 0 && (
          <button className="btn-danger" onClick={clearLibrary}>
            Clear Library
          </button>
        )}
      </div>

      {/* ── Empty state ── */}
      {library.length === 0 ? (
        <div className="empty-state">
          <p>Your library is empty. Start adding books from the Books page!</p>
        </div>
      ) : (
        <ul className="book-list">
          {library.map((book) => (
            <li
              key={book.id ?? book._id}
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
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ── Book detail modal ── */}
      {selectedBook && (
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
            
            {/* Notes section */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontWeight: 600,
                color: 'var(--text)',
                marginBottom: '8px',
                fontSize: '0.9rem',
              }}>
                My Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your personal notes about this book..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text)',
                  fontSize: '0.9rem',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={closeModal}>
                Close
              </button>
              <button
                className="btn-accent"
                onClick={async () => {
                  await saveNotes(selectedBook.id || selectedBook._id, notes);
                  closeModal();
                }}
              >
                Save Notes
              </button>
              <button
                className="btn-danger"
                onClick={() => handleRemove(selectedBook)}
              >
                Remove from Library
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;