import React, { useState } from 'react';

const Books = () => {
  // Initialize an empty array for books
  const [books, setBooks] = useState([
  { title: "Example", author: "Example Author", year: 2026 },
  { title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960 },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925 }
]); 

  // Container styles
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
  };

  const emptyStateStyle = {
    textAlign: 'center',
    color: '#666',
    padding: '40px',
    fontSize: '1.2rem',
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
          {books.map((book, index) => (
            <li key={index} style={bookItemStyle}>
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>Year: {book.year}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Books;