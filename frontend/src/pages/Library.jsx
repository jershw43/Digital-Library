import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Capacitor } from '@capacitor/core';

const TABS = [
  { key: 'reading', label: 'In Progress', emoji: '📖', color: '#fd7e14' },
  { key: 'want-to-read', label: 'Want to Read', emoji: '🔖', color: '#6c757d' },
  { key: 'finished', label: 'Completed', emoji: '✅', color: '#28a745' },
];

<<<<<<< Updated upstream
const Library = () => {
  const { library, removeFromLibrary, clearLibrary, saveNotes, updateStatus } = useLibrary();

  const [activeTab, setActiveTab] = useState('reading');
  const [selectedBook, setSelectedBook] = useState(null);
  const [notes, setNotes] = useState('');

  const isNative = Capacitor.isNativePlatform();

  const openModal = (book) => {
    setSelectedBook(book);
    setNotes(book.notes || '');
  };

  const closeModal = () => setSelectedBook(null);
=======
const TABS = [
  { key: 'reading',       label: 'In Progress', emoji: '📖', color: '#fd7e14' },
  { key: 'want-to-read',  label: 'Want to Read', emoji: '🔖', color: '#6c757d' },
  { key: 'finished',      label: 'Completed',    emoji: '✅', color: '#28a745' },
];

const Library = () => {
  const { library, removeFromLibrary, clearLibrary, saveNotes, updateStatus } = useLibrary();
  const [activeTab, setActiveTab]     = useState('reading');
  const [selectedBook, setSelectedBook] = useState(null);
  const [notes, setNotes]               = useState('');

  const openModal  = (book) => { setSelectedBook(book); setNotes(book.notes || ''); };
  const closeModal = ()     => setSelectedBook(null);
>>>>>>> Stashed changes

  const handleRemove = (book) => {
    if (window.confirm(`Remove "${book.title}" from your library?`)) {
      removeFromLibrary(book.id || book._id);
      closeModal();
    }
  };

  const handleStatusChange = async (bookId, newStatus) => {
    await updateStatus(bookId, newStatus);
<<<<<<< Updated upstream
    if (selectedBook) {
      setSelectedBook((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const activeBooks = library.filter(
    (b) => (b.status || 'want-to-read') === activeTab
  );

  const activeTabData = TABS.find((t) => t.key === activeTab);

  return (
    <div className="page-container" style={{ paddingTop: '16px' }}>

      {/* Header */}
=======
    if (selectedBook) setSelectedBook((prev) => ({ ...prev, status: newStatus }));
  };

  const activeBooks = library.filter((b) => (b.status || 'want-to-read') === activeTab);

  return (
    <div className="page-container">

      {/* ── Header ── */}
>>>>>>> Stashed changes
      <div className="library-header">
        <div>
          <h2>My Library</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            {library.length} book{library.length !== 1 ? 's' : ''}
          </p>
        </div>
        {library.length > 0 && (
          <button className="btn-danger" onClick={clearLibrary}>Clear Library</button>
        )}
      </div>

<<<<<<< Updated upstream
      {/* Tabs — dropdown on mobile, tab bar on web */}
      {isNative ? (
        <div style={{ marginBottom: '24px' }}>
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: `2px solid ${activeTabData?.color || 'var(--border)'}`,
              backgroundColor: 'var(--bg-secondary)',
              color: activeTabData?.color || 'var(--text)',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {TABS.map((tab) => {
              const count = library.filter(
                (b) => (b.status || 'want-to-read') === tab.key
              ).length;
              return (
                <option key={tab.key} value={tab.key}>
                  {tab.emoji} {tab.label} ({count})
                </option>
              );
            })}
          </select>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '2px solid var(--border)',
        }}>
          {TABS.map((tab) => {
            const count = library.filter(
              (b) => (b.status || 'want-to-read') === tab.key
            ).length;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderBottom: isActive
                    ? `3px solid ${tab.color}`
                    : '3px solid transparent',
                  backgroundColor: 'transparent',
                  color: isActive ? tab.color : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 400,
                  cursor: 'pointer',
                  minHeight: 'unset',
                }}
              >
                {tab.emoji} {tab.label} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Content */}
      {library.length === 0 ? (
        <div className="empty-state">
          <p>Your library is empty.</p>
        </div>
      ) : activeBooks.length === 0 ? (
        <div className="empty-state">
          <p>No books in this category.</p>
=======
      {/* ── Tabs ── */}
      <div style={{
        display: 'flex', gap: '8px', marginBottom: '24px',
        borderBottom: '2px solid var(--border)', paddingBottom: '0',
      }}>
        {TABS.map((tab) => {
          const count = library.filter((b) => (b.status || 'want-to-read') === tab.key).length;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderBottom: isActive ? `3px solid ${tab.color}` : '3px solid transparent',
                backgroundColor: 'transparent',
                color: isActive ? tab.color : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 400,
                fontSize: '0.95rem',
                cursor: 'pointer',
                marginBottom: '-2px',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              {tab.emoji} {tab.label}
              <span style={{
                backgroundColor: isActive ? tab.color : 'var(--border)',
                color: isActive ? '#fff' : 'var(--text-muted)',
                borderRadius: '12px', padding: '1px 8px',
                fontSize: '0.75rem', fontWeight: 700,
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Book list ── */}
      {library.length === 0 ? (
        <div className="empty-state">
          <p>Your library is empty. Start adding books from the home page!</p>
        </div>
      ) : activeBooks.length === 0 ? (
        <div className="empty-state">
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No books in this category yet.
          </p>
>>>>>>> Stashed changes
        </div>
      ) : (
        <ul className="book-list">
          {activeBooks.map((book) => (
            <li
              key={book.id ?? book._id}
              className="book-item"
              onClick={() => openModal(book)}
            >
              {book.thumbnail && (
<<<<<<< Updated upstream
                <img src={book.thumbnail} alt="" className="book-thumbnail" />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ margin: '0 0 4px' }}>{book.title}</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{book.author}</p>
              </div>
              <select
                value={book.status || 'want-to-read'}
                onChange={(e) => handleStatusChange(book.id ?? book._id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="want-to-read">Want to Read</option>
                <option value="reading">In Progress</option>
                <option value="finished">Completed</option>
              </select>
=======
                <img src={book.thumbnail} alt={book.title} className="book-thumbnail" />
              )}
              <div className="book-info" style={{ flex: 1 }}>
                <h3 className="book-title">{book.title}</h3>
                <p className="book-meta">{book.author} • {book.year}</p>
              </div>
              <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center' }}>
                <select
                  value={book.status || 'want-to-read'}
                  onChange={(e) => handleStatusChange(book.id ?? book._id, e.target.value)}
                  style={{
                    padding: '6px 10px', borderRadius: '6px',
                    border: `1px solid ${TABS.find(t => t.key === (book.status || 'want-to-read'))?.color}`,
                    backgroundColor: 'var(--surface)',
                    color: TABS.find(t => t.key === (book.status || 'want-to-read'))?.color,
                    fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                  }}
                >
                  <option value="want-to-read">Want to Read</option>
                  <option value="reading">In Progress</option>
                  <option value="finished">Completed</option>
                </select>
              </div>
>>>>>>> Stashed changes
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {selectedBook && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
<<<<<<< Updated upstream

            {/* Title + thumbnail */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'flex-start' }}>
              {selectedBook.thumbnail && (
                <img
                  src={selectedBook.thumbnail}
                  alt=""
                  style={{ width: '70px', height: '105px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                />
              )}
              <div>
                <h2 className="modal-title" style={{ marginBottom: '4px' }}>{selectedBook.title}</h2>
                {selectedBook.year && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{selectedBook.year}</p>
                )}
              </div>
            </div>

            {/* Author */}
            {selectedBook.author && (
              <div style={{ marginBottom: '12px' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Author</p>
                <p style={{ margin: '2px 0 0', color: 'var(--text)' }}>{selectedBook.author}</p>
              </div>
=======
            <h2 className="modal-title">{selectedBook.title}</h2>
            <p className="modal-meta"><strong>Author:</strong> {selectedBook.author}</p>
            <p className="modal-meta"><strong>Year:</strong> {selectedBook.year}</p>
            {selectedBook.publisher && (
              <p className="modal-meta"><strong>Publisher:</strong> {selectedBook.publisher}</p>
>>>>>>> Stashed changes
            )}

            {/* Description */}
            {selectedBook.description && (
              <div style={{ marginBottom: '12px' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</p>
                <p style={{ margin: '2px 0 0', color: 'var(--text)', fontSize: '0.9rem', lineHeight: '1.6' }}>{selectedBook.description}</p>
              </div>
            )}

            {/* Pages */}
            {selectedBook.pageCount && (
              <div style={{ marginBottom: '12px' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pages</p>
                <p style={{ margin: '2px 0 0', color: 'var(--text)' }}>{selectedBook.pageCount}</p>
              </div>
            )}
<<<<<<< Updated upstream

            {/* Notes */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ margin: '0 0 6px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notes</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes here..."
                className="modal-notes__input"
                style={{ width: '100%' }}
=======
            <p className="modal-description">
              <strong>Description:</strong>{' '}
              {selectedBook.description || 'No description available.'}
            </p>

            {/* Status selector */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text)', marginBottom: '8px', fontSize: '0.9rem' }}>
                Reading Status
              </label>
              <select
                value={selectedBook.status || 'want-to-read'}
                onChange={(e) => handleStatusChange(selectedBook.id ?? selectedBook._id, e.target.value)}
                style={{
                  padding: '8px 12px', borderRadius: '8px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text)', fontSize: '0.9rem', cursor: 'pointer',
                }}
              >
                <option value="want-to-read">Want to Read</option>
                <option value="reading">In Progress</option>
                <option value="finished">Completed</option>
              </select>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text)', marginBottom: '8px', fontSize: '0.9rem' }}>
                My Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your personal notes about this book..."
                style={{
                  width: '100%', minHeight: '120px', padding: '10px 14px',
                  borderRadius: '8px', border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-secondary)', color: 'var(--text)',
                  fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
>>>>>>> Stashed changes
              />
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={closeModal}>Close</button>
              <button
                className="btn-accent"
                onClick={async () => { await saveNotes(selectedBook.id || selectedBook._id, notes); closeModal(); }}
              >
                Save Notes
              </button>
              <button className="btn-danger" onClick={() => handleRemove(selectedBook)}>
<<<<<<< Updated upstream
                Remove
=======
                Remove from Library
>>>>>>> Stashed changes
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Library;