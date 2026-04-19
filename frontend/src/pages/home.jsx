import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { searchBooks } from '../services/googleBooksAPI';
import { useLibrary, SHELVES } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { Capacitor } from '@capacitor/core';

const truncate = (str, n) => str && str.length > n ? str.slice(0, n) + '…' : str;

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  page: {
    padding: '20px',
<<<<<<< Updated upstream
    paddingTop: '20px',
    maxWidth: '900px',
    margin: '0 auto 60px',
=======
    maxWidth: '900px',
    margin: '100px auto 60px',
>>>>>>> Stashed changes
  },
  card: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '28px 24px',
    marginBottom: '28px',
    boxShadow: '0 2px 8px var(--shadow)',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'var(--text)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '0 0 16px 0',
  },
  searchRow: {
    display: 'flex',
    gap: '10px',
<<<<<<< Updated upstream
    flexWrap: 'wrap',
  },
  input: {
    flex: '1 1 100%',
=======
  },
  input: {
    flex: 1,
>>>>>>> Stashed changes
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--surface)',
    color: 'var(--text)',
    fontSize: '1rem',
    outline: 'none',
<<<<<<< Updated upstream
    minWidth: '0',
=======
>>>>>>> Stashed changes
  },
  btn: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'var(--accent)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
<<<<<<< Updated upstream
    flex: '1 1 auto',
    minWidth: '80px',
=======
>>>>>>> Stashed changes
  },
  btnSecondary: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text)',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
<<<<<<< Updated upstream
    flex: '1 1 auto',
    minWidth: '80px',
=======
>>>>>>> Stashed changes
  },
  scanBtn: {
    marginTop: '12px',
    padding: '12px 24px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text)',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  bookItem: {
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
  },
  thumbnail: {
    width: '60px',
    height: '90px',
    objectFit: 'cover',
    borderRadius: '4px',
    backgroundColor: 'var(--border)',
    flexShrink: 0,
  },
  thumbnailPlaceholder: {
    width: '60px',
    height: '90px',
    borderRadius: '4px',
    backgroundColor: 'var(--border)',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
  },
  aiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '12px',
    marginTop: '4px',
  },
  aiChip: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
    padding: '14px 18px',
    backgroundColor: 'var(--surface)',
    border: '1px dashed var(--border)',
    borderRadius: '8px',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
  shelfGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '16px',
    marginTop: '4px',
  },
  bookCard: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.18s, box-shadow 0.18s',
  },
  coverImg: {
    width: '100%',
    height: '120px',
    objectFit: 'cover',
    backgroundColor: 'var(--border)',
  },
  coverPlaceholder: {
    width: '100%',
    height: '120px',
    backgroundColor: 'var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    color: 'var(--text-muted)',
  },
  progressBarWrap: {
    height: '4px',
    backgroundColor: 'var(--border)',
    borderRadius: '2px',
    marginTop: '8px',
    overflow: 'hidden',
  },
  viewAllBtn: {
    marginTop: '16px',
    display: 'inline-block',
    fontSize: '0.85rem',
    color: 'var(--accent)',
    cursor: 'pointer',
    textDecoration: 'underline',
    background: 'none',
    border: 'none',
    padding: 0,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  modalContent: {
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
  },
  closeBtn: {
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

const addBtnStyle = (inLibrary, isAdding) => ({
  backgroundColor: inLibrary ? '#28a745' : 'var(--accent)',
  color: '#fff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '5px',
  cursor: inLibrary || isAdding ? 'default' : 'pointer',
  fontSize: '0.9rem',
  opacity: isAdding ? 0.7 : 1,
  transition: 'background-color 0.2s',
});

// ── Component ─────────────────────────────────────────────────────────────────

const Home = () => {
  const [query, setQuery]               = useState('');
  const [books, setBooks]               = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [hasSearched, setHasSearched]   = useState(false);
  const [addingId, setAddingId]         = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [statusModalBook, setStatusModalBook] = useState(null);

  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading]           = useState(false);
  const [recError, setRecError]               = useState(null);

  const { library, addToLibrary, isInLibrary, getShelfForBook } = useLibrary();
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isNative = Capacitor.isNativePlatform();

  // ── Effects ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (location.state?.scannedBook) {
      setBooks([location.state.scannedBook]);
      setHasSearched(true);
    }
  }, [location.state]);

  useEffect(() => {
    if (!user || library.length === 0) return;
    setRecLoading(true);
    authFetch('/api/recommendations')
      .then((res) => res.json())
      .then((data) => setRecommendations(data.recommendations || []))
      .catch(() => setRecError('Could not load recommendations.'))
      .finally(() => setRecLoading(false));
  }, [user, library]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleScan = async () => {
    try {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.EAN_13,
        scanInstructions: 'Point at the barcode on the back cover',
        scanButton: false,
      });
      if (result.ScanResult) {
        setLoading(true);
        const results = await searchBooks(`isbn:${result.ScanResult}`);
        if (results.length > 0) {
          setBooks(results);
          setHasSearched(true);
          setError(null);
        } else {
          setError(`No book found for ISBN: ${result.ScanResult}`);
        }
        setLoading(false);
      }
    } catch (err) {
      console.error('Scan error:', err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const isIsbn = /^[\d\-]{9,17}$/.test(query.trim());
      const searchQuery = isIsbn ? `isbn:${query.trim()}` : query;
      const results = await searchBooks(searchQuery);
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

  const handleAddToLibrary = async (book, status = 'reading') => {
    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }
    setAddingId(book.id);
    await addToLibrary(book, status);
    setAddingId(null);
    setStatusModalBook(null);
  };

  // ── Derived values ───────────────────────────────────────────────────────────

  const firstName   = user?.displayName?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'Reader';
  const recentBooks = library.slice(0, 5);

  // ── Sub-components ───────────────────────────────────────────────────────────

  const BookButtons = ({ book, stopProp = true }) => {
    const inLibrary = isInLibrary(book.id);
    const isAdding  = addingId === book.id;
    return (
      <div
<<<<<<< Updated upstream
        style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
=======
        style={{ display: 'flex', gap: '8px' }}
>>>>>>> Stashed changes
        onClick={stopProp ? (e) => e.stopPropagation() : undefined}
      >
        <button
          style={addBtnStyle(inLibrary, isAdding)}
          disabled={inLibrary || isAdding}
          onClick={() => { if (!inLibrary) setStatusModalBook(book); }}
        >
          {inLibrary ? '✓ In Library' : isAdding ? 'Adding...' : '+ Add to Library'}
        </button>
        {!inLibrary && (
          <button
            style={{ ...addBtnStyle(false, false), backgroundColor: '#6c757d' }}
            onClick={() => handleAddToLibrary(book, 'want-to-read')}
          >
            Want to Read
          </button>
        )}
      </div>
    );
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div style={styles.page}>

      {/* Greeting */}
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
        Welcome back, {firstName} 👋
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '1rem' }}>
        What are we reading today?
      </p>

      {/* ── Search card ── */}
      <div style={styles.card}>
        <p style={styles.cardTitle}>Find a Book</p>

        <form onSubmit={handleSearch} style={styles.searchRow}>
          <input
            style={styles.input}
            type="text"
            placeholder="Search by title, author, or ISBN…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </button>
          {hasSearched && (
            <button type="button" onClick={handleClear} style={styles.btnSecondary}>
              Clear
            </button>
          )}
        </form>

        {isNative && (
          <button onClick={handleScan} style={styles.scanBtn}>
            📷 Scan ISBN Barcode
          </button>
        )}

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
            {books.map((book) => (
              <li
                key={book.id}
                style={styles.bookItem}
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
                  ? <img src={book.thumbnail} alt={book.title} style={styles.thumbnail} />
                  : <div style={styles.thumbnailPlaceholder}>📖</div>
                }
<<<<<<< Updated upstream
                <div style={{ flex: 1, minWidth: 0 }}>
=======
                <div style={{ flex: 1 }}>
>>>>>>> Stashed changes
                  <h3 style={{ margin: '0 0 4px', color: 'var(--text)', fontSize: '1rem' }}>{book.title}</h3>
                  <p style={{ margin: '0 0 10px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    {book.author} • {book.year}
                  </p>
                  <BookButtons book={book} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── AI Recommendations card ── */}
      <div style={styles.card}>
        <p style={styles.cardTitle}>✦ AI Recommendations</p>

        {recLoading && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Finding books you'll love...</p>
        )}
        {recError && (
          <p style={{ color: 'var(--danger)', fontSize: '0.88rem' }}>{recError}</p>
        )}
        {!recLoading && !recError && recommendations.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 14px' }}>
            Add books to your library to get personalised recommendations.
          </p>
        )}
        {recommendations.length > 0 && (
          <div style={styles.aiGrid}>
            {recommendations.map((rec, i) => (
              <div key={i} style={styles.aiChip}>
                <strong style={{ color: 'var(--text)' }}>{rec.title}</strong>
                <span style={{ fontSize: '0.8rem' }}>by {rec.author}</span>
                <span style={{ fontSize: '0.8rem' }}>{rec.reason}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── My Library shelf card ── */}
      <div style={styles.card}>
        <p style={styles.cardTitle}>My Library</p>

        {recentBooks.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            You haven't added any books yet. Search above to get started!
          </p>
        ) : (
          <>
            <div style={styles.shelfGrid}>
              {recentBooks.map((book) => (
                <div
                  key={book.id}
                  style={styles.bookCard}
                  onClick={() => navigate('/library')}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 16px var(--shadow)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {book.thumbnail
                    ? <img src={book.thumbnail} alt={book.title} style={styles.coverImg} />
                    : <div style={styles.coverPlaceholder}>📖</div>
                  }
                  <div style={{ padding: '10px', flex: 1 }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 4px', lineHeight: 1.3 }}>
                      {truncate(book.title, 40)}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0 0 4px' }}>
                      {truncate(book.author, 28)}
                    </p>
                    <div style={styles.progressBarWrap}>
                      <div style={{
                        height: '100%',
                        width: `${book.progress ?? 0}%`,
                        backgroundColor: 'var(--accent)',
                        borderRadius: '2px',
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button style={styles.viewAllBtn} onClick={() => navigate('/library')}>
              View full library ({library.length} book{library.length !== 1 ? 's' : ''}) →
            </button>
          </>
        )}
      </div>

      {/* ── Book detail modal ── */}
      {selectedBook && (() => {
        const inLibrary = isInLibrary(selectedBook.id);
        const isAdding  = addingId === selectedBook.id;
        return (
          <div style={styles.modalOverlay} onClick={() => setSelectedBook(null)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ marginTop: 0, color: 'var(--accent)' }}>{selectedBook.title}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}><strong>Author:</strong> {selectedBook.author}</p>
              <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}><strong>Year:</strong> {selectedBook.year}</p>
              {selectedBook.publisher && (
                <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}><strong>Publisher:</strong> {selectedBook.publisher}</p>
              )}
              {selectedBook.pageCount && (
                <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}><strong>Pages:</strong> {selectedBook.pageCount}</p>
              )}
              <div style={{ lineHeight: '1.6', marginBottom: '20px' }}>
                <strong>Description:</strong>
                <p style={{ color: 'var(--text-muted)' }}>{selectedBook.description || 'No description available.'}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button style={styles.closeBtn} onClick={() => setSelectedBook(null)}>Close</button>
                <BookButtons book={selectedBook} stopProp={false} />
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Status picker modal ── */}
      {statusModalBook && (
        <div style={styles.modalOverlay} onClick={() => setStatusModalBook(null)}>
          <div
            style={{ ...styles.modalContent, maxWidth: '380px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, color: 'var(--accent)' }}>Add to Library</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
              How are you reading{' '}
              <strong style={{ color: 'var(--text)' }}>{statusModalBook.title}</strong>?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                style={{ ...styles.btn, backgroundColor: '#fd7e14', padding: '14px' }}
                onClick={() => handleAddToLibrary(statusModalBook, 'reading')}
              >
                📖 In Progress
              </button>
              <button
                style={{ ...styles.btn, backgroundColor: '#28a745', padding: '14px' }}
                onClick={() => handleAddToLibrary(statusModalBook, 'finished')}
              >
                ✅ Completed
              </button>
            </div>
            <button
              style={{ ...styles.btnSecondary, marginTop: '12px', width: '100%' }}
              onClick={() => setStatusModalBook(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;