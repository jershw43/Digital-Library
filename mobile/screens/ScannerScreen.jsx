import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { searchByISBN } from '../services/googleBooksAPI';

const { width } = Dimensions.get('window');
const FRAME_SIZE = width * 0.72;

export default function ScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const lastScanned = useRef(null);

  useEffect(() => {
    if (scanned) {
      const t = setTimeout(() => setScanned(false), 3000);
      return () => clearTimeout(t);
    }
  }, [scanned]);

  const handleBarcode = async ({ data }) => {
    if (scanned || loading) return;
    if (data === lastScanned.current) return;
    lastScanned.current = data;
    setScanned(true);
    setLoading(true);
    try {
      const book = await searchByISBN(data);
      if (book) {
        navigation.navigate('BookDetail', { book });
      } else {
        Alert.alert(
          'Book Not Found',
          `No results for ISBN: ${data}`,
          [{ text: 'Scan Again', onPress: () => { setScanned(false); lastScanned.current = null; } }]
        );
      }
    } catch {
      Alert.alert('Error', 'Failed to look up book. Check your connection.', [
        { text: 'Retry', onPress: () => { setScanned(false); lastScanned.current = null; } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#6C63FF" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permText}>Camera access is needed to scan barcodes.</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
        }}
        onBarcodeScanned={!scanned && !loading ? handleBarcode : undefined}
      />

      {/* Dark overlay with scan frame cutout */}
      <View style={styles.overlay}>
        <View style={styles.overlayTop} />
        <View style={styles.overlayMiddle}>
          <View style={styles.overlaySide} />
          <View style={styles.frame}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Looking up book...</Text>
              </View>
            )}
          </View>
          <View style={styles.overlaySide} />
        </View>
        <View style={styles.overlayBottom}>
          <Text style={styles.hint}>
            {loading
              ? 'Fetching book details…'
              : scanned
              ? 'Found! Loading…'
              : 'Point at the barcode on the back cover'}
          </Text>
          {scanned && !loading && (
            <TouchableOpacity
              style={styles.rescanBtn}
              onPress={() => { setScanned(false); lastScanned.current = null; }}
            >
              <Text style={styles.rescanText}>Scan Another</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const CORNER = 20;
const BORDER = 3;
const ACCENT = '#6C63FF';

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#000' },
  center:         { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#0f0f0f' },
  overlay:        { flex: 1 },
  overlayTop:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  overlayMiddle:  { flexDirection: 'row', height: FRAME_SIZE * 0.55 },
  overlaySide:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  overlayBottom:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', paddingTop: 24 },
  frame:          { width: FRAME_SIZE, height: FRAME_SIZE * 0.55, position: 'relative' },
  corner:         { position: 'absolute', width: CORNER, height: CORNER, borderColor: ACCENT, borderWidth: BORDER },
  tl:             { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 4 },
  tr:             { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 4 },
  bl:             { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 4 },
  br:             { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 4 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center', gap: 10 },
  loadingText:    { color: '#fff', fontSize: 14 },
  hint:           { color: '#ccc', fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },
  rescanBtn:      { marginTop: 16, paddingHorizontal: 24, paddingVertical: 10, backgroundColor: ACCENT, borderRadius: 8 },
  rescanText:     { color: '#fff', fontWeight: '600', fontSize: 15 },
  permText:       { color: '#ccc', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  permBtn:        { backgroundColor: ACCENT, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 8 },
  permBtnText:    { color: '#fff', fontWeight: '600', fontSize: 15 },
});