import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Capacitor } from '@capacitor/core';

const TABS = [
  { key: 'reading', label: 'In Progress', emoji: '📖', color: '#fd7e14' },
  { key: 'want-to-read', label: 'Want to Read', emoji: '🔖', color: '#6c757d' },
  { key: 'finished', label: 'Completed', emoji: '✅', color: '#28a745' },
];

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

  const handleRemove = (book) => {
    if (window.confirm(`Remove "${book.title}" from your library?`)) {
      removeFromLibrary(book.id || book._id);
      closeModal();
    }
  };

  const handleStatusChange = async (bookId, newStatus) => {
    await updateStatus(bookId, newStatus);
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
      <div className="library-header">
        <div>
          <h2>My Library</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            {library.length} book{library.length !== 1 ? 's' : ''}
          </p>
        </div>
        {library.length > 0 && (
          <button className="btn-danger" onClick={clearLibrary}>
            Clear Library
          </button>
        )}
      </div>

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
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {selectedBook && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

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

            {selectedBook.author && (
              <div style={{ marginBottom: '12px' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Author</p>
                <p style={{ margin: '2px 0 0', color: 'var(--text)' }}>{selectedBook.author}</p>
              </div>
            )}

            {selectedBook.description && (
              <div style={{ marginBottom: '12px' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</p>
                <p style={{ margin: '2px 0 0', color: 'var(--text)', fontSize: '0.9rem', lineHeight: '1.6' }}>{selectedBook.description}</p>
              </div>
            )}

            {selectedBook.pageCount && (
              <div style={{ marginBottom: '12px' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pages</p>
                <p style={{ margin: '2px 0 0', color: 'var(--text)' }}>{selectedBook.pageCount}</p>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <p style={{ margin: '0 0 6px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notes</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes here..."
                className="modal-notes__input"
                style={{ width: '100%' }}
              />
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={closeModal}>Close</button>
              <button
                className="btn-accent"
                onClick={async () => {
                  await saveNotes(selectedBook.id || selectedBook._id, notes);
                  closeModal();
                }}
              >
                Save Notes
              </button>
              <button className="btn-danger" onClick={() => handleRemove(selectedBook)}>
                Remove
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Library;