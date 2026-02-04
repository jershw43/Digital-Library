import React, { useState } from 'react';

const Books = () => {
  // Sample book data for testing
  const [books, setBooks] = useState([
    { 
      id: 1,
      title: "Example Book", 
      author: "Example Author", 
      year: 2026,
      description: "An example book object to display in the library."
    },
  
  ]);

  const [selectedBook, setSelectedBook] = useState(null);

  const openModal = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  const addToLibrary = (book) => {
    console.log('Adding to library:', book.title);
    // Add your library logic here later
    closeModal();
  };

  // Styles
  const containerStyle = {
    marginTop: '100px',
    padding: '20px',
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
  };

  const bookItemHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
  };

  const emptyStateStyle = {
    textAlign: 'center',
    color: '#666',
    padding: '40px',
    fontSize: '1.2rem',
  };

  // Modal styles
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

  const addButtonStyle = {
    backgroundColor: '#007bff',
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
      <h2>Books Page</h2>
      <p>Browse our collection of books here.</p>

      {books.length === 0 ? (
        <div style={emptyStateStyle}>
          <p>No books available yet. Check back soon!</p>
        </div>
      ) : (
        <ul style={listStyle}>
          {books.map((book) => (
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
              <h3 style={{ margin: '0 0 5px 0' }}>{book.title}</h3>
              <p style={{ margin: '0', color: '#666' }}>
                {book.author} • {book.year}
              </p>
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
                style={addButtonStyle}
                onClick={() => addToLibrary(selectedBook)}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
              >
                Add to Library
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;