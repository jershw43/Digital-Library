import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useAuth, API_BASE } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login, authFetch } = useAuth();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      console.log('Attempting login to:', API_BASE + '/api/auth/login');
      const res  = await authFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);
      if (!res.ok) throw new Error(data.message || 'Login failed');
      await login(data.token, data.username);
      navigation.replace('Main');
    } catch (err) {
      console.log('Login error:', err.message);
      console.log('Full error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>

          {error ? <Text style={styles.errorMsg}>{error}</Text> : null}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={v => handleChange('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={form.password}
            onChangeText={v => handleChange('password', v)}
            secureTextEntry
            autoComplete="current-password"
            placeholderTextColor="#666"
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Log In</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.switchText}>
              Don't have an account? <Text style={styles.link}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page:        { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#0f0f0f' },
  card:        { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 32, borderWidth: 1, borderColor: '#2a2a2a' },
  title:       { fontSize: 24, fontWeight: '700', color: '#6C63FF', textAlign: 'center', marginBottom: 24 },
  label:       { fontSize: 14, fontWeight: '500', color: '#ccc', marginBottom: 6 },
  input:       { backgroundColor: '#111', color: '#fff', borderWidth: 1, borderColor: '#333', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 16 },
  button:      { backgroundColor: '#6C63FF', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  buttonText:  { color: '#fff', fontWeight: '700', fontSize: 16 },
  errorMsg:    { backgroundColor: 'rgba(220,53,69,0.15)', color: '#dc3545', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14 },
  switchText:  { marginTop: 20, textAlign: 'center', color: '#888', fontSize: 14 },
  link:        { color: '#6C63FF' },
});