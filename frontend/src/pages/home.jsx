import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchBooks } from '../services/googleBooksAPI';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';

const truncate = (str, n) => str && str.length > n ? str.slice(0, n) + '…' : str;

const Home = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  const { library, addToLibrary, isInLibrary } = useLibrary();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
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

  const handleClear = () => {
    setQuery('');
    setBooks([]);
    setError(null);
    setHasSearched(false);
  };

  const handleAddToLibrary = async (book) => {
    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }
    setAddingId(book.id);
    await addToLibrary(book);
    setAddingId(null);
  };

  // ── Styles ───────────────────────────────────────────────────────────────────

  const page = {
    padding: '20px',
    maxWidth: '900px',
    margin: '100px auto 60px',
  };

  const card = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '28px 24px',
    marginBottom: '28px',
    boxShadow: '0 2px 8px var(--shadow)',
  };

  const cardTitle = {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'var(--text)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '0 0 16px 0',
  };

  const searchRow = { display: 'flex', gap: '10px' };

  const inputStyle = {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--surface)',
    color: 'var(--text)',
    fontSize: '1rem',
    outline: 'none',
  };

  const searchBtn = {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'var(--accent)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  };

  const bookItemStyle = {
    padding: '15px',
    marginBottom: '10px',
    backgroundColor: 'var(--surface)',
    borderRadius: '8px',
    boxShadow: '0 2px 4px var(--shadow)',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    gap: '15px',
  };

  const thumbnailStyle = {
    width: '60px', height: '90px', objectFit: 'cover',
    borderRadius: '4px', backgroundColor: 'var(--border)', flexShrink: 0,
  };

  const addBtnStyle = (inLibrary, isAdding) => ({
    backgroundColor: inLibrary ? '#28a745' : 'var(--accent)',
    color: '#fff', border: 'none',
    padding: '8px 16px', borderRadius: '5px',
    cursor: inLibrary || isAdding ? 'default' : 'pointer',
    fontSize: '0.9rem', opacity: isAdding ? 0.7 : 1,
    transition: 'background-color 0.2s',
  });

  const comingSoonBadge = {
    fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.05em',
    textTransform: 'uppercase', backgroundColor: 'var(--accent)',
    color: '#fff', padding: '2px 8px', borderRadius: '20px',
    marginLeft: 'auto', opacity: 0.85,
  };

  const aiGrid = {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '12px', marginTop: '4px',
  };

  const aiChip = {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '14px 18px', backgroundColor: 'var(--surface)',
    border: '1px dashed var(--border)', borderRadius: '8px',
    color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic',
  };

  const shelfGrid = {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '16px', marginTop: '4px',
  };

  const bookCard = {
    display: 'flex', flexDirection: 'column',
    backgroundColor: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: '8px', overflow: 'hidden',
    cursor: 'pointer', transition: 'transform 0.18s, box-shadow 0.18s',
  };

  const coverImg = {
    width: '100%', height: '120px', objectFit: 'cover', backgroundColor: 'var(--border)',
  };

  const coverPlaceholder = {
    ...coverImg, display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '2rem', color: 'var(--text-muted)',
  };

  const progressBarWrap = {
    height: '4px', backgroundColor: 'var(--border)',
    borderRadius: '2px', marginTop: '8px', overflow: 'hidden',
  };

  const viewAllBtn = {
    marginTop: '16px', display: 'inline-block', fontSize: '0.85rem',
    color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline',
    background: 'none', border: 'none', padding: 0,
  };

  const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000,
  };

  const modalContentStyle = {
    backgroundColor: 'var(--surface)', color: 'var(--text)',
    border: '1px solid var(--border)', padding: '30px', borderRadius: '12px',
    maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto',
    boxShadow: '0 8px 16px var(--shadow)',
  };

  const closeBtnStyle = {
    backgroundColor: 'var(--bg-secondary)', color: 'var(--text)',
    border: '1px solid var(--border)', padding: '10px 20px',
    borderRadius: '5px', cursor: 'pointer',
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  const firstName = user?.displayName?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'Reader';
  const recentBooks = library.slice(0, 6);
  const aiPlaceholders = [
    'Based on your recent reads',
    'Trending in your genres',
    'Hidden gems you might love',
  ];

  return (
    <div style={page}>

      {/* ── Greeting ── */}
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
        Welcome back, {firstName} 👋
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '1rem' }}>
        What are we reading today?
      </p>

      {/* ── Search ── */}
      <div style={card}>
        <p style={cardTitle}>Find a Book</p>
        <form onSubmit={handleSearch} style={searchRow}>
          <input
            style={inputStyle}
            type="text"
            placeholder="Search by title, author, or ISBN…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" style={searchBtn} disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </button>
          {hasSearched && (
            <button
              type="button"
              onClick={handleClear}
              style={{ ...searchBtn, backgroundColor: 'var(--bg-secondary)', color: 'var(--text)', border: '1px solid var(--border)' }}
            >
              Clear
            </button>
          )}
        </form>

        {loading && (
          <p style={{ color: 'var(--accent)', marginTop: '16px' }}>Searching for books...</p>
        )}

        {error && !loading && (
          <p style={{ color: 'var(--danger)', marginTop: '16px' }}>{error}</p>
        )}

        {!hasSearched && !loading && (
          <p style={{ color: 'var(--text-muted)', marginTop: '16px', fontSize: '0.88rem', fontStyle: 'italic' }}>
            Search by title, author, or ISBN to get started.
          </p>
        )}

        {!loading && books.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0' }}>
            {books.map((book) => {
              const inLibrary = isInLibrary(book.id);
              return (
                <li
                  key={book.id}
                  style={bookItemStyle}
                  onClick={() => setSelectedBook(book)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px var(--shadow)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px var(--shadow)';
                  }}
                >
                  {book.thumbnail
                    ? <img src={book.thumbnail} alt={book.title} style={thumbnailStyle} />
                    : <div style={{ ...thumbnailStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📖</div>
                  }
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 4px', color: 'var(--text)', fontSize: '1rem' }}>{book.title}</h3>
                    <p style={{ margin: '0 0 10px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      {book.author} • {book.year}
                    </p>
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
      </div>

      {/* ── AI Recommendations ── */}
      <div style={card}>
        <p style={cardTitle}>
          AI Recommendations
          <span style={comingSoonBadge}>Coming soon</span>
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 14px' }}>
          Personalised picks powered by your reading history — available soon.
        </p>
        <div style={aiGrid}>
          {aiPlaceholders.map((label) => (
            <div key={label} style={aiChip}>
              <span style={{ color: 'var(--accent)' }}>✦</span>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── My Library shelf ── */}
      <div style={card}>
        <p style={cardTitle}>My Library</p>
        {recentBooks.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            You haven't added any books yet. Search above to get started!
          </p>
        ) : (
          <>
            <div style={shelfGrid}>
              {recentBooks.map((book) => (
                <div
                  key={book.id}
                  style={bookCard}
                  onClick={() => navigate('/library')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px var(--shadow)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {book.thumbnail
                    ? <img src={book.thumbnail} alt={book.title} style={coverImg} />
                    : <div style={coverPlaceholder}>📖</div>
                  }
                  <div style={{ padding: '10px', flex: 1 }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 4px', lineHeight: 1.3 }}>
                      {truncate(book.title, 40)}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                      {truncate(book.author, 28)}
                    </p>
                    <div style={progressBarWrap}>
                      <div style={{
                        height: '100%', width: `${book.progress ?? 0}%`,
                        backgroundColor: 'var(--accent)', borderRadius: '2px',
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button style={viewAllBtn} onClick={() => navigate('/library')}>
              View full library ({library.length} book{library.length !== 1 ? 's' : ''}) →
            </button>
          </>
        )}
      </div>

      {/* ── Book Detail Modal ── */}
      {selectedBook && (() => {
        const inLibrary = isInLibrary(selectedBook.id);
        const isAdding = addingId === selectedBook.id;
        return (
          <div style={modalOverlayStyle} onClick={() => setSelectedBook(null)}>
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
                <button style={closeBtnStyle} onClick={() => setSelectedBook(null)}>Close</button>
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

export default Home;