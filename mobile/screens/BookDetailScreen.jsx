import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView,
  TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';

export default function BookDetailScreen({ route, navigation }) {
  const { book } = route.params;
  const { addToLibrary, isInLibrary } = useLibrary();
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);
  const inLibrary = isInLibrary(book.id);

  const handleAdd = async () => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    setAdding(true);
    await addToLibrary(book);
    setAdding(false);
    Alert.alert('Added!', `"${book.title}" has been added to your library.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {book.thumbnail ? (
        <Image source={{ uri: book.thumbnail }} style={styles.cover} />
      ) : (
        <View style={styles.coverPlaceholder}>
          <Text style={{ fontSize: 48 }}>📖</Text>
        </View>
      )}

      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>{book.author}</Text>

      <View style={styles.metaRow}>
        {book.year !== 'N/A' && (
          <View style={styles.metaBadge}>
            <Text style={styles.metaBadgeText}>{book.year}</Text>
          </View>
        )}
        {book.pageCount !== 'N/A' && (
          <View style={styles.metaBadge}>
            <Text style={styles.metaBadgeText}>{book.pageCount} pages</Text>
          </View>
        )}
        {book.publisher !== 'Unknown Publisher' && (
          <View style={styles.metaBadge}>
            <Text style={styles.metaBadgeText}>{book.publisher}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {book.description || 'No description available.'}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.addBtn, inLibrary && styles.addBtnDone]}
        disabled={inLibrary || adding}
        onPress={handleAdd}
      >
        <Text style={styles.addBtnText}>
          {inLibrary ? '✓ In Library' : adding ? 'Adding…' : '+ Add to Library'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#0f0f0f' },
  content:          { padding: 24, alignItems: 'center', paddingBottom: 48 },
  cover:            { width: 150, height: 225, borderRadius: 10, marginBottom: 24, backgroundColor: '#222' },
  coverPlaceholder: { width: 150, height: 225, borderRadius: 10, marginBottom: 24, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2a2a2a' },
  title:            { fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 6 },
  author:           { fontSize: 15, color: '#aaa', textAlign: 'center', marginBottom: 16 },
  metaRow:          { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 24 },
  metaBadge:        { backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#2a2a2a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  metaBadgeText:    { color: '#888', fontSize: 13 },
  section:          { width: '100%', marginBottom: 28 },
  sectionTitle:     { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 10 },
  description:      { fontSize: 14, color: '#aaa', lineHeight: 22 },
  addBtn:           { backgroundColor: '#6C63FF', paddingVertical: 14, borderRadius: 10, width: '100%', alignItems: 'center' },
  addBtnDone:       { backgroundColor: '#28a745' },
  addBtnText:       { color: '#fff', fontWeight: '700', fontSize: 16 },
});