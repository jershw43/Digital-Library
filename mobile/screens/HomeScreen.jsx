import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  Image, StyleSheet, ActivityIndicator, Modal, ScrollView,
} from 'react-native';
import { searchBooks } from '../services/googleBooksAPI';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const [query, setQuery]           = useState('');
  const [books, setBooks]           = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [addingId, setAddingId]     = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  const { addToLibrary, isInLibrary } = useLibrary();
  const { user } = useAuth();

  const firstName = user?.username?.split(' ')[0] ?? 'Reader';

  const handleSearch = async () => {
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
    setQuery(''); setBooks([]); setError(null); setHasSearched(false);
  };

  const handleAddToLibrary = async (book) => {
    if (!user) { navigation.navigate('Login'); return; }
    setAddingId(book.id);
    await addToLibrary(book);
    setAddingId(null);
  };

  const renderBook = ({ item }) => {
    const inLibrary = isInLibrary(item.id);
    const isAdding  = addingId === item.id;
    return (
      <TouchableOpacity style={styles.bookItem} onPress={() => setSelectedBook(item)}>
        {item.thumbnail
          ? <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          : <View style={[styles.thumbnail, styles.thumbPlaceholder]}><Text style={{ fontSize: 24 }}>📖</Text></View>
        }
        <View style={{ flex: 1 }}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <Text style={styles.bookMeta}>{item.author} · {item.year}</Text>
          <TouchableOpacity
            style={[styles.addBtn, inLibrary && styles.addBtnDone]}
            disabled={inLibrary || isAdding}
            onPress={() => handleAddToLibrary(item)}
          >
            <Text style={styles.addBtnText}>
              {inLibrary ? '✓ In Library' : isAdding ? 'Adding...' : '+ Add to Library'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Greeting */}
        <Text style={styles.greeting}>Welcome back, {firstName} 👋</Text>
        <Text style={styles.subgreeting}>What are we reading today?</Text>

        {/* Search */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Find a Book</Text>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.input}
              placeholder="Search by title, author, or ISBN…"
              placeholderTextColor="#555"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} disabled={loading}>
              <Text style={styles.searchBtnText}>{loading ? '...' : 'Search'}</Text>
            </TouchableOpacity>
          </View>
          {hasSearched && (
            <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>Clear results</Text>
            </TouchableOpacity>
          )}
          {loading && <ActivityIndicator color="#6C63FF" style={{ marginTop: 16 }} />}
          {error && !loading && <Text style={styles.errorText}>{error}</Text>}
          {!hasSearched && !loading && (
            <Text style={styles.hint}>Search by title, author, or ISBN to get started.</Text>
          )}
        </View>

        {/* Results */}
        {!loading && books.length > 0 && (
          <FlatList
            data={books}
            keyExtractor={item => item.id}
            renderItem={renderBook}
            scrollEnabled={false}
          />
        )}

        {/* AI Recommendations placeholder */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>AI Recommendations</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>COMING SOON</Text></View>
          </View>
          <Text style={styles.muted}>Personalised picks powered by your reading history — available soon.</Text>
        </View>

      </ScrollView>

      {/* Book Detail Modal */}
      <Modal visible={!!selectedBook} animationType="slide" transparent onRequestClose={() => setSelectedBook(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedBook && (() => {
              const inLibrary = isInLibrary(selectedBook.id);
              const isAdding  = addingId === selectedBook.id;
              return (
                <ScrollView>
                  <Text style={styles.modalTitle}>{selectedBook.title}</Text>
                  <Text style={styles.modalMeta}><Text style={styles.bold}>Author: </Text>{selectedBook.author}</Text>
                  <Text style={styles.modalMeta}><Text style={styles.bold}>Year: </Text>{selectedBook.year}</Text>
                  {selectedBook.publisher !== 'Unknown Publisher' && (
                    <Text style={styles.modalMeta}><Text style={styles.bold}>Publisher: </Text>{selectedBook.publisher}</Text>
                  )}
                  {selectedBook.pageCount !== 'N/A' && (
                    <Text style={styles.modalMeta}><Text style={styles.bold}>Pages: </Text>{selectedBook.pageCount}</Text>
                  )}
                  <Text style={styles.modalMeta}>{selectedBook.description || 'No description available.'}</Text>
                  <View style={styles.modalActions}>
                    <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedBook(null)}>
                      <Text style={styles.closeBtnText}>Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.addBtn, inLibrary && styles.addBtnDone, { flex: 1 }]}
                      disabled={inLibrary || isAdding}
                      onPress={() => handleAddToLibrary(selectedBook)}
                    >
                      <Text style={styles.addBtnText}>
                        {inLibrary ? '✓ In Library' : isAdding ? 'Adding...' : '+ Add to Library'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              );
            })()}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#0f0f0f' },
  scroll:       { padding: 20, paddingTop: 60 },
  greeting:     { fontSize: 26, fontWeight: '700', color: '#fff', marginBottom: 4 },
  subgreeting:  { fontSize: 15, color: '#888', marginBottom: 28 },
  card:         { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#2a2a2a' },
  cardTitle:    { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 14 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  badge:        { marginLeft: 10, backgroundColor: '#6C63FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  badgeText:    { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  searchRow:    { flexDirection: 'row', gap: 10 },
  input:        { flex: 1, backgroundColor: '#111', color: '#fff', borderWidth: 1, borderColor: '#333', borderRadius: 8, padding: 12, fontSize: 15 },
  searchBtn:    { backgroundColor: '#6C63FF', paddingHorizontal: 18, borderRadius: 8, justifyContent: 'center' },
  searchBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  clearBtn:     { marginTop: 10 },
  clearBtnText: { color: '#6C63FF', fontSize: 13 },
  errorText:    { color: '#dc3545', marginTop: 12, fontSize: 14 },
  hint:         { color: '#555', marginTop: 14, fontSize: 13, fontStyle: 'italic' },
  muted:        { color: '#666', fontSize: 13 },
  bookItem:     { flexDirection: 'row', gap: 14, backgroundColor: '#1a1a1a', borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#2a2a2a' },
  thumbnail:    { width: 55, height: 82, borderRadius: 6, backgroundColor: '#333' },
  thumbPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  bookTitle:    { fontSize: 15, fontWeight: '600', color: '#fff', marginBottom: 4 },
  bookMeta:     { fontSize: 13, color: '#888', marginBottom: 10 },
  addBtn:       { backgroundColor: '#6C63FF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  addBtnDone:   { backgroundColor: '#28a745' },
  addBtnText:   { color: '#fff', fontWeight: '600', fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1a1a1a', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 28, maxHeight: '85%', borderWidth: 1, borderColor: '#2a2a2a' },
  modalTitle:   { fontSize: 20, fontWeight: '700', color: '#6C63FF', marginBottom: 14 },
  modalMeta:    { fontSize: 14, color: '#aaa', marginBottom: 10, lineHeight: 22 },
  bold:         { color: '#ccc', fontWeight: '600' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 20, alignItems: 'center' },
  closeBtn:     { backgroundColor: '#2a2a2a', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#444' },
  closeBtnText: { color: '#fff', fontWeight: '600' },
});