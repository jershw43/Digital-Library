import { useState } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, Modal, ScrollView, Alert, TextInput,
} from 'react-native';
import { useLibrary } from '../context/LibraryContext';

export default function LibraryScreen() {
  const { library, removeFromLibrary, clearLibrary, saveNotes } = useLibrary();
  const [selectedBook, setSelectedBook] = useState(null);
  const [notes, setNotes] = useState('');

    const openModal = (book) => {
        setSelectedBook(book);
        setNotes(book.notes || '');
    };  

  const handleRemove = (book) => {
    Alert.alert(
      'Remove Book',
      `Remove "${book.title}" from your library?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove', style: 'destructive',
          onPress: () => { removeFromLibrary(book.id || book._id); setSelectedBook(null); },
        },
      ]
    );
  };

  const renderBook = ({ item }) => (
    <TouchableOpacity style={styles.bookItem} onPress={() => openModal(item)}>
      {item.thumbnail
        ? <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        : <View style={[styles.thumbnail, styles.thumbPlaceholder]}><Text style={{ fontSize: 28 }}>📖</Text></View>
      }
      <View style={{ flex: 1 }}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookMeta}>{item.author} · {item.year}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>My Library</Text>
          <Text style={styles.subheading}>Your personal collection of saved books</Text>
        </View>
        {library.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={clearLibrary}>
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {library.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Your library is empty.</Text>
          <Text style={styles.emptySubtext}>Search or scan a book to get started!</Text>
        </View>
      ) : (
        <FlatList
          data={library}
          keyExtractor={item => item.id || item._id}
          renderItem={renderBook}
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      {/* Book Detail Modal */}
      <Modal
        visible={!!selectedBook}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedBook(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedBook && (
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
                <Text style={styles.modalMeta}>
                  <Text style={styles.bold}>Description: </Text>
                  {selectedBook.description || 'No description available.'}
                </Text>

                {/* Notes section */}
                <View style={{ marginBottom: 20, marginTop: 10 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 8 }}>
                    My Notes
                  </Text>
                  <TextInput
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Add your personal notes about this book..."
                    placeholderTextColor="#555"
                    multiline
                    numberOfLines={4}
                    style={{
                      backgroundColor: '#111',
                      color: '#fff',
                      borderWidth: 1,
                      borderColor: '#333',
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 14,
                      minHeight: 100,
                      textAlignVertical: 'top',
                    }}
                  />
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedBook(null)}>
                    <Text style={styles.closeBtnText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={async () => {
                      await saveNotes(selectedBook.id || selectedBook._id, notes);
                      setSelectedBook(null);
                    }}
                  >
                    <Text style={styles.saveBtnText}>Save Notes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(selectedBook)}>
                    <Text style={styles.removeBtnText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#0f0f0f' },
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: '#222' },
  heading:        { fontSize: 22, fontWeight: '700', color: '#fff' },
  subheading:     { fontSize: 13, color: '#888', marginTop: 2 },
  clearBtn:       { backgroundColor: '#dc3545', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  clearBtnText:   { color: '#fff', fontWeight: '600', fontSize: 14 },
  bookItem:       { flexDirection: 'row', gap: 14, backgroundColor: '#1a1a1a', borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#2a2a2a' },
  thumbnail:      { width: 70, height: 105, borderRadius: 6, backgroundColor: '#333' },
  thumbPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  bookTitle:      { fontSize: 15, fontWeight: '600', color: '#fff', marginBottom: 4 },
  bookMeta:       { fontSize: 13, color: '#888' },
  empty:          { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText:      { fontSize: 18, color: '#ccc', fontWeight: '600', marginBottom: 8 },
  emptySubtext:   { fontSize: 14, color: '#666', textAlign: 'center' },
  modalOverlay:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent:   { backgroundColor: '#1a1a1a', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 28, maxHeight: '85%', borderWidth: 1, borderColor: '#2a2a2a' },
  modalTitle:     { fontSize: 20, fontWeight: '700', color: '#6C63FF', marginBottom: 14 },
  modalMeta:      { fontSize: 14, color: '#aaa', marginBottom: 10, lineHeight: 22 },
  bold:           { color: '#ccc', fontWeight: '600' },
  modalActions:   { flexDirection: 'row', gap: 10, justifyContent: 'flex-end', marginTop: 20 },
  closeBtn:       { backgroundColor: '#2a2a2a', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#444' },
  closeBtnText:   { color: '#fff', fontWeight: '600' },
  removeBtn:      { backgroundColor: '#dc3545', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  removeBtnText:  { color: '#fff', fontWeight: '600' },
  saveBtn:     { backgroundColor: '#6C63FF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  saveBtnText: { color: '#fff', fontWeight: '600' },
});