import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';

const Library = () => {
  const { library, removeFromLibrary, clearLibrary } = useLibrary();
  const [selectedBook, setSelectedBook] = useState(null);

  const openModal = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  const handleRemove = (book) => {
    if (window.confirm(`Remove "${book.title}" from your library?`)) {
      removeFromLibrary(book.id);
      closeModal();
    }
  };

  // Styles (reusing from Books.jsx)
  const containerStyle = {
    marginTop: '100px',
    padding: '20px',
  };

  const headerContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '800px',
    margin: '0 auto 20px',
  };

  const clearButtonStyle = {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  };

  const listStyle = {
    listStyleType: 'none',
    padding: '0',
    maxWidth: '800px',
    margin: '0 auto',
  };

  const bookItemStyle = {
    padding: '15px',
    marginBottom: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    gap: '15px',
  };

  const bookItemHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
  };

  const thumbnailStyle = {
    width: '80px',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '4px',
    backgroundColor: '#ddd',
  };

  const bookInfoStyle = {
    flex: 1,
  };

  const emptyStateStyle = {
    textAlign: 'center',
    color: '#666',
    padding: '40px',
    fontSize: '1.2rem',
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  };

  const modalHeaderStyle = {
    marginTop: '0',
    color: '#007bff',
  };

  const modalInfoStyle = {
    color: '#666',
    marginBottom: '15px',
  };

  const modalDescriptionStyle = {
    lineHeight: '1.6',
    marginBottom: '20px',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  };

  const removeButtonStyle = {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
  };

  const closeButtonStyle = {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
  };

  return (
    <div style={containerStyle}>
      <div style={headerContainerStyle}>
        <div>
          <h2>My Library</h2>
          <p>Your personal collection of saved books</p>
        </div>
        {library.length > 0 && (
          <button
            style={clearButtonStyle}
            onClick={clearLibrary}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
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
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = bookItemHoverStyle.transform;
                e.currentTarget.style.boxShadow = bookItemHoverStyle.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = bookItemStyle.boxShadow;
              }}
            >
              {book.thumbnail && (
                <img src={book.thumbnail} alt={book.title} style={thumbnailStyle} />
              )}
              <div style={bookInfoStyle}>
                <h3 style={{ margin: '0 0 5px 0' }}>{book.title}</h3>
                <p style={{ margin: '0', color: '#666' }}>
                  {book.author} • {book.year}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {selectedBook && (
        <div style={modalOverlayStyle} onClick={closeModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={modalHeaderStyle}>{selectedBook.title}</h2>
            <p style={modalInfoStyle}>
              <strong>Author:</strong> {selectedBook.author}
            </p>
            <p style={modalInfoStyle}>
              <strong>Year:</strong> {selectedBook.year}
            </p>
            {selectedBook.publisher && (
              <p style={modalInfoStyle}>
                <strong>Publisher:</strong> {selectedBook.publisher}
              </p>
            )}
            {selectedBook.pageCount && (
              <p style={modalInfoStyle}>
                <strong>Pages:</strong> {selectedBook.pageCount}
              </p>
            )}
            <div style={modalDescriptionStyle}>
              <strong>Description:</strong>
              <p>{selectedBook.description || 'No description available.'}</p>
            </div>
            <div style={buttonContainerStyle}>
              <button
                style={closeButtonStyle}
                onClick={closeModal}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
              >
                Close
              </button>
              <button
                style={removeButtonStyle}
                onClick={() => handleRemove(selectedBook)}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
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