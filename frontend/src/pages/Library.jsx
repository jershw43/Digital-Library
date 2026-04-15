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
// import React, { useState } from 'react';
// import { useLibrary, SHELVES } from '../context/LibraryContext';

// const SHELF_COLORS = {
//   'Want to Read': '#6c63ff',
//   'Currently Reading': '#f5a623',
//   'Finished Reading': '#28a745',
// };

// const SHELF_ICONS = {
//   'Want to Read': '📚',
//   'Currently Reading': '📖',
//   'Finished Reading': '✅',
// };

// const Library = () => {
//   const { library, removeFromLibrary, clearLibrary, saveNotes, moveToShelf } = useLibrary();
//   const [selectedBook, setSelectedBook] = useState(null);
//   const [notes, setNotes] = useState('');
//   const [activeShelf, setActiveShelf] = useState('All');

//   const openModal = (book) => {
//     setSelectedBook(book);
//     setNotes(book.notes || '');
//   };
//   const closeModal = () => setSelectedBook(null);

// const TABS = [
//   { key: 'reading',       label: 'In Progress', emoji: '📖', color: '#fd7e14' },
//   { key: 'want-to-read',  label: 'Want to Read', emoji: '🔖', color: '#6c757d' },
//   { key: 'finished',      label: 'Completed',    emoji: '✅', color: '#28a745' },
// ];

// const Library = () => {
//   const { library, removeFromLibrary, clearLibrary, saveNotes, updateStatus } = useLibrary();
//   const [activeTab, setActiveTab]     = useState('reading');
//   const [selectedBook, setSelectedBook] = useState(null);
//   const [notes, setNotes]               = useState('');

//   const openModal  = (book) => { setSelectedBook(book); setNotes(book.notes || ''); };
//   const closeModal = ()     => setSelectedBook(null);

//   const handleRemove = (book) => {
//     if (window.confirm(`Remove "${book.title}" from your library?`)) {
//       removeFromLibrary(book.id || book._id);
//       closeModal();
//     }
//   };

//   const handleMoveShelf = async (bookId, shelf) => {
//     await moveToShelf(bookId, shelf);
//     // Keep modal in sync if it's open
//     if (selectedBook && (selectedBook.id === bookId || selectedBook._id === bookId)) {
//       setSelectedBook((prev) => ({ ...prev, shelf }));
//     }
//   };

//   const shelfTabs = ['All', ...SHELVES];
//   const displayedBooks =
//     activeShelf === 'All' ? library : library.filter((b) => b.shelf === activeShelf);

//   const handleStatusChange = async (bookId, newStatus) => {
//     await updateStatus(bookId, newStatus);
//     if (selectedBook) setSelectedBook((prev) => ({ ...prev, status: newStatus }));
//   };

//   const activeBooks = library.filter((b) => (b.status || 'want-to-read') === activeTab);

//   return (
//     <div className="page-container">

//       {/* ── Header ── */}
//       <div className="library-header">
//         <div>
//           <h2>My Library</h2>
//           <p style={{ color: 'var(--text-muted)', margin: 0 }}>
//             {library.length} book{library.length !== 1 ? 's' : ''} in your collection
//           </p>
//         </div>
//         {library.length > 0 && (
//           <button className="btn-danger" onClick={clearLibrary}>Clear Library</button>
//         )}
//       </div>

//       {/* ── Shelf tabs ── */}
//       {library.length > 0 && (
//         <div className="shelf-tabs">
//           {shelfTabs.map((shelf) => {
//             const count =
//               shelf === 'All'
//                 ? library.length
//                 : library.filter((b) => b.shelf === shelf).length;
//             const isActive = activeShelf === shelf;
//             return (
//               <button
//                 key={shelf}
//                 className={`shelf-tab ${isActive ? 'shelf-tab--active' : ''}`}
//                 style={
//                   isActive && shelf !== 'All'
//                     ? { backgroundColor: SHELF_COLORS[shelf], borderColor: SHELF_COLORS[shelf], color: '#fff' }
//                     : {}
//                 }
//                 onClick={() => setActiveShelf(shelf)}
//               >
//                 {shelf === 'All' ? '📚' : SHELF_ICONS[shelf]} {shelf} ({count})
//               </button>
//             );
//           })}
//         </div>
//       )}

//       {/* ── Empty states ── */}
//       {library.length === 0 ? (
//         <div className="empty-state">
//           <p>Your library is empty. Search for books on the home page to get started!</p>
//         </div>
//       ) : displayedBooks.length === 0 ? (
//         <div className="empty-state">
//           <p>No books on this shelf yet.</p>
//         </div>
//       ) : (
//         <ul className="book-list">
//           {displayedBooks.map((book) => (
//       {/* ── Tabs ── */}
//       <div style={{
//         display: 'flex', gap: '8px', marginBottom: '24px',
//         borderBottom: '2px solid var(--border)', paddingBottom: '0',
//       }}>
//         {TABS.map((tab) => {
//           const count = library.filter((b) => (b.status || 'want-to-read') === tab.key).length;
//           const isActive = activeTab === tab.key;
//           return (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               style={{
//                 padding: '10px 20px',
//                 border: 'none',
//                 borderBottom: isActive ? `3px solid ${tab.color}` : '3px solid transparent',
//                 backgroundColor: 'transparent',
//                 color: isActive ? tab.color : 'var(--text-muted)',
//                 fontWeight: isActive ? 700 : 400,
//                 fontSize: '0.95rem',
//                 cursor: 'pointer',
//                 marginBottom: '-2px',
//                 transition: 'all 0.2s',
//                 display: 'flex', alignItems: 'center', gap: '6px',
//               }}
//             >
//               {tab.emoji} {tab.label}
//               <span style={{
//                 backgroundColor: isActive ? tab.color : 'var(--border)',
//                 color: isActive ? '#fff' : 'var(--text-muted)',
//                 borderRadius: '12px', padding: '1px 8px',
//                 fontSize: '0.75rem', fontWeight: 700,
//               }}>
//                 {count}
//               </span>
//             </button>
//           );
//         })}
//       </div>

//       {/* ── Book list ── */}
//       {library.length === 0 ? (
//         <div className="empty-state">
//           <p>Your library is empty. Start adding books from the home page!</p>
//         </div>
//       ) : activeBooks.length === 0 ? (
//         <div className="empty-state">
//           <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
//             No books in this category yet.
//           </p>
//         </div>
//       ) : (
//         <ul className="book-list">
//           {activeBooks.map((book) => (
//             <li
//               key={book.id ?? book._id}
//               className="book-item"
//               onClick={() => openModal(book)}
//             >
//               {book.thumbnail && (
//                 <img src={book.thumbnail} alt={book.title} className="book-thumbnail" />
//               )}
//               <div className="book-info" style={{ flex: 1 }}>
//                 <h3 className="book-title">{book.title}</h3>
//                 <p className="book-meta">{book.author} • {book.year}</p>

//                 {/* Shelf badge */}
//                 {book.shelf && (
//                   <span
//                     className="shelf-badge"
//                     style={{
//                       backgroundColor: SHELF_COLORS[book.shelf] + '22',
//                       color: SHELF_COLORS[book.shelf],
//                       borderColor: SHELF_COLORS[book.shelf] + '55',
//                     }}
//                   >
//                     {SHELF_ICONS[book.shelf]} {book.shelf}
//                   </span>
//                 )}

//                 {/* Inline shelf mover — stop propagation so it doesn't open modal */}
//                 <div
//                   className="shelf-mover"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <span className="shelf-mover__label">Move to:</span>
//                   {SHELVES.map((shelf) => (
//                     <button
//                       key={shelf}
//                       className={`shelf-mover__btn ${book.shelf === shelf ? 'shelf-mover__btn--active' : ''}`}
//                       style={
//                         book.shelf === shelf
//                           ? { backgroundColor: SHELF_COLORS[shelf], borderColor: SHELF_COLORS[shelf], color: '#fff' }
//                           : { color: SHELF_COLORS[shelf], borderColor: SHELF_COLORS[shelf] + '88' }
//                       }
//                       onClick={() => handleMoveShelf(book.id ?? book._id, shelf)}
//                       disabled={book.shelf === shelf}
//                     >
//                       {SHELF_ICONS[shelf]}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center' }}>
//                 <select
//                   value={book.status || 'want-to-read'}
//                   onChange={(e) => handleStatusChange(book.id ?? book._id, e.target.value)}
//                   style={{
//                     padding: '6px 10px', borderRadius: '6px',
//                     border: `1px solid ${TABS.find(t => t.key === (book.status || 'want-to-read'))?.color}`,
//                     backgroundColor: 'var(--surface)',
//                     color: TABS.find(t => t.key === (book.status || 'want-to-read'))?.color,
//                     fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
//                   }}
//                 >
//                   <option value="want-to-read">Want to Read</option>
//                   <option value="reading">In Progress</option>
//                   <option value="finished">Completed</option>
//                 </select>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* ── Book detail modal ── */}
//       {selectedBook && (
//         <div className="modal-overlay" onClick={closeModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <h2 className="modal-title">{selectedBook.title}</h2>

//             {/* Current shelf badge */}
//             {selectedBook.shelf && (
//               <span
//                 className="shelf-badge"
//                 style={{
//                   backgroundColor: SHELF_COLORS[selectedBook.shelf] + '22',
//                   color: SHELF_COLORS[selectedBook.shelf],
//                   borderColor: SHELF_COLORS[selectedBook.shelf] + '55',
//                   display: 'inline-block',
//                   marginBottom: '16px',
//                 }}
//               >
//                 {SHELF_ICONS[selectedBook.shelf]} {selectedBook.shelf}
//               </span>
//             )}
//             <p className="modal-meta"><strong>Author:</strong> {selectedBook.author}</p>
//             <p className="modal-meta"><strong>Year:</strong> {selectedBook.year}</p>
//             {selectedBook.publisher && (
//               <p className="modal-meta"><strong>Publisher:</strong> {selectedBook.publisher}</p>
//             )}
//             {selectedBook.pageCount && (
//               <p className="modal-meta"><strong>Pages:</strong> {selectedBook.pageCount}</p>
//             )}
//             <p className="modal-description">
//               <strong>Description:</strong>{' '}
//               {selectedBook.description || 'No description available.'}
//             </p>

//             {/* ── Move to shelf ── */}
//             <div className="modal-shelf-section">
//               <p className="modal-shelf-section__label">Move to shelf:</p>
//               <div className="modal-shelf-btns">
//                 {SHELVES.map((shelf) => (
//                   <button
//                     key={shelf}
//                     className={`modal-shelf-btn ${selectedBook.shelf === shelf ? 'modal-shelf-btn--active' : ''}`}
//                     style={
//                       selectedBook.shelf === shelf
//                         ? { backgroundColor: SHELF_COLORS[shelf], borderColor: SHELF_COLORS[shelf], color: '#fff' }
//                         : { color: SHELF_COLORS[shelf], borderColor: SHELF_COLORS[shelf] + '88', backgroundColor: SHELF_COLORS[shelf] + '11' }
//                     }
//                     onClick={() => handleMoveShelf(selectedBook.id ?? selectedBook._id, shelf)}
//                   >
//                     {SHELF_ICONS[shelf]} {shelf}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* ── Notes ── */}
//             <div className="modal-notes">
//               <label className="modal-notes__label">My Notes</label>
//             {/* Status selector */}
//             <div style={{ marginBottom: '20px' }}>
//               <label style={{ display: 'block', fontWeight: 600, color: 'var(--text)', marginBottom: '8px', fontSize: '0.9rem' }}>
//                 Reading Status
//               </label>
//               <select
//                 value={selectedBook.status || 'want-to-read'}
//                 onChange={(e) => handleStatusChange(selectedBook.id ?? selectedBook._id, e.target.value)}
//                 style={{
//                   padding: '8px 12px', borderRadius: '8px',
//                   border: '1px solid var(--border)',
//                   backgroundColor: 'var(--bg-secondary)',
//                   color: 'var(--text)', fontSize: '0.9rem', cursor: 'pointer',
//                 }}
//               >
//                 <option value="want-to-read">Want to Read</option>
//                 <option value="reading">In Progress</option>
//                 <option value="finished">Completed</option>
//               </select>
//             </div>

//             {/* Notes */}
//             <div style={{ marginBottom: '20px' }}>
//               <label style={{ display: 'block', fontWeight: 600, color: 'var(--text)', marginBottom: '8px', fontSize: '0.9rem' }}>
//                 My Notes
//               </label>
//               <textarea
//                 className="modal-notes__input"
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 placeholder="Add your personal notes about this book..."
//                 style={{
//                   width: '100%', minHeight: '120px', padding: '10px 14px',
//                   borderRadius: '8px', border: '1px solid var(--border)',
//                   backgroundColor: 'var(--bg-secondary)', color: 'var(--text)',
//                   fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit',
//                   boxSizing: 'border-box',
//                 }}
//               />
//             </div>

//             <div className="modal-actions">
//               <button className="btn-secondary" onClick={closeModal}>Close</button>
//               <button
//                 className="btn-accent"
//                 onClick={async () => { await saveNotes(selectedBook.id || selectedBook._id, notes); closeModal(); }}
//               >
//                 Save Notes
//               </button>
//               <button className="btn-danger" onClick={() => handleRemove(selectedBook)}>
//                 Remove from Library
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Library;