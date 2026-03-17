import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';

const Library = () => {
  const { library, removeFromLibrary, clearLibrary } = useLibrary();
  const [selectedBook, setSelectedBook] = useState(null);

  const openModal = (book) => setSelectedBook(book);
  const closeModal = () => setSelectedBook(null);

  const handleRemove = (book) => {
    if (window.confirm(`Remove "${book.title}" from your library?`)) {
      removeFromLibrary(book.id);
      closeModal();
    }
  };

  const containerStyle = { marginTop: '100px', padding: '20px' };

  const headerContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '800px',
    margin: '0 auto 20px',
  };

  const listStyle = { listStyleType: 'none', padding: '0', maxWidth: '800px', margin: '0 auto' };

  const bookItemStyle = {
    padding: '15px',
    marginBottom: '10px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '8px',
    boxShadow: '0 2px 4px var(--shadow)',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    gap: '15px',
  };

  const thumbnailStyle = {
    width: '80px', height: '120px', objectFit: 'cover',
    borderRadius: '4px', backgroundColor: 'var(--border)',
  };

  const emptyStateStyle = {
    textAlign: 'center', color: 'var(--text-muted)', padding: '40px', fontSize: '1.2rem',
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
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 8px 16px var(--shadow)',
  };

  return (
    <div style={containerStyle}>
      <div style={headerContainerStyle}>
        <div>
          <h2>My Library</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Your personal collection of saved books</p>
        </div>
        {library.length > 0 && (
          <button
            style={{ backgroundColor: 'var(--danger)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
            onClick={clearLibrary}
          >
            Clear Library
          </button>
        )}
      </div>

      {library.length === 0 ? (
        <div style={emptyStateStyle}>
          <p>Your library is empty. Start adding books from the Books page!</p>
        </div>
      ) : (
        <ul style={listStyle}>
          {library.map((book) => (
            <li
              key={book.id}
              style={bookItemStyle}
              onClick={() => openModal(book)}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 8px var(--shadow)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 4px var(--shadow)'; }}
            >
              {book.thumbnail && <img src={book.thumbnail} alt={book.title} style={thumbnailStyle} />}
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0', color: 'var(--text)' }}>{book.title}</h3>
                <p style={{ margin: '0', color: 'var(--text-muted)' }}>{book.author} • {book.year}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedBook && (
        <div style={modalOverlayStyle} onClick={closeModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0, color: 'var(--accent)' }}>{selectedBook.title}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}><strong>Author:</strong> {selectedBook.author}</p>
            <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}><strong>Year:</strong> {selectedBook.year}</p>
            {selectedBook.publisher && <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}><strong>Publisher:</strong> {selectedBook.publisher}</p>}
            {selectedBook.pageCount && <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}><strong>Pages:</strong> {selectedBook.pageCount}</p>}
            <div style={{ lineHeight: '1.6', marginBottom: '20px' }}>
              <strong>Description:</strong>
              <p style={{ color: 'var(--text-muted)' }}>{selectedBook.description || 'No description available.'}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
                onClick={closeModal}
              >Close</button>
              <button
                style={{ backgroundColor: 'var(--danger)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
                onClick={() => handleRemove(selectedBook)}
              >Remove from Library</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
