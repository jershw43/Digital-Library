import React, { useState } from 'react';

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

 // SearchBar.jsx — make it full width and touch friendly
const containerStyle = {
  width: '100%',
  padding: '0',           // let the parent handle padding
  maxWidth: '600px',
  margin: '0 auto var(--space-lg)',
};

const formStyle = {
  display: 'flex',
  gap: '8px',
  width: '100%',
};

const inputStyle = {
  flex: 1,
  padding: '12px 16px',
  fontSize: '16px',       // 16px prevents iOS auto-zoom on focus
  border: '2px solid var(--accent)',
  borderRadius: '8px',
  outline: 'none',
  minHeight: '44px',
  backgroundColor: 'var(--bg-secondary)',
  color: 'var(--input-color)',
};

const buttonStyle = {
  padding: '12px 20px',
  fontSize: '16px',
  backgroundColor: loading ? '#ccc' : 'var(--accent)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: loading ? 'not-allowed' : 'pointer',
  minHeight: '44px',
  whiteSpace: 'nowrap',
  flexShrink: 0,
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
          onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = 'var(--accent-hover)')}
          onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = 'var(--accent)')}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;