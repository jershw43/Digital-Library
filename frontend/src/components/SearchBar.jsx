import React, { useState } from 'react';

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  };

  const formStyle = {
    display: 'flex',
    gap: '10px',
    width: '100%',
  };

  const inputStyle = {
    flex: 1,
    padding: '12px 20px',
    fontSize: '16px',
    border: '2px solid #007bff',
    borderRadius: '8px',
    outline: 'none',
  };

  const buttonStyle = {
    padding: '12px 30px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1,
    transition: 'background-color 0.2s',
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books..."
          style={inputStyle}
          disabled={loading}
        />
        <button 
          type="submit" 
          style={buttonStyle}
          disabled={loading}
          onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#007bff')}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;