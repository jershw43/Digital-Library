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
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '2px solid var(--border)',
        }}
      >
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
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {tab.emoji} {tab.label}
              <span
                style={{
                  backgroundColor: isActive ? tab.color : 'var(--border)',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  borderRadius: '12px',
                  padding: '1px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Book list */}
      {library.length === 0 ? (
        <div className="empty-state">
          <p>Your library is empty. Start adding books from the home page!</p>
        </div>
      ) : activeBooks.length === 0 ? (
        <div className="empty-state">
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No books in this category yet.
          </p>
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
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="book-thumbnail"
                />
              )}

              <div className="book-info" style={{ flex: 1 }}>
                <h3 className="book-title">{book.title}</h3>
                <p className="book-meta">
                  {book.author} • {book.year}
                </p>
              </div>

              <div
                onClick={(e) => e.stopPropagation()}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <select
                  value={book.status || 'want-to-read'}
                  onChange={(e) =>
                    handleStatusChange(
                      book.id ?? book._id,
                      e.target.value
                    )
                  }
                >
                  <option value="want-to-read">Want to Read</option>
                  <option value="reading">In Progress</option>
                  <option value="finished">Completed</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {selectedBook && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title">{selectedBook.title}</h2>
            <p><strong>Author:</strong> {selectedBook.author}</p>
            <p><strong>Year:</strong> {selectedBook.year}</p>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
              style={{ width: '100%', minHeight: '120px' }}
            />

            <div className="modal-actions">
              <button onClick={closeModal}>Close</button>
              <button
                onClick={async () => {
                  await saveNotes(
                    selectedBook.id || selectedBook._id,
                    notes
                  );
                  closeModal();
                }}
              >
                Save
              </button>
              <button
                className="btn-danger"
                onClick={() => handleRemove(selectedBook)}
              >
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