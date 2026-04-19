import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';

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

  return (
    <div className="page-container">

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

      {/* Tabs */}
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
              }}
            >
              {tab.emoji} {tab.label} ({count})
            </button>
          );
        })}
      </div>

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

              <div style={{ flex: 1 }}>
                <h3>{book.title}</h3>
                <p>{book.author}</p>
              </div>

              <select
                value={book.status || 'want-to-read'}
                onChange={(e) =>
                  handleStatusChange(book.id ?? book._id, e.target.value)
                }
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
            <h2>{selectedBook.title}</h2>
            <p>{selectedBook.author}</p>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes..."
            />

            <div className="modal-actions">
              <button onClick={closeModal}>Close</button>
              <button
                onClick={async () => {
                  await saveNotes(selectedBook.id || selectedBook._id, notes);
                  closeModal();
                }}
              >
                Save
              </button>
              <button onClick={() => handleRemove(selectedBook)}>
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