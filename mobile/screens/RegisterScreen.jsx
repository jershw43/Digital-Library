import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';

const validatePassword = (password) => {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  return null;
};

export default function RegisterScreen({ navigation }) {
  const [form, setForm]             = useState({ username: '', email: '', password: '', confirm: '' });
  const [errors, setErrors]         = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading]       = useState(false);

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Username is required';
    if (!form.email.trim())    e.email    = 'Email is required';
    const pwErr = validatePassword(form.password);
    if (pwErr) e.password = pwErr;
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const res  = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, email: form.email, password: form.password }),
      });
      const text = await res.text();
      if (!text) { setServerError('Server returned an empty response'); return; }
      const data = JSON.parse(text);
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      navigation.navigate('Login', { message: 'Account created! Please check your email to verify.' });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, secure, keyboard, hint }) => (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[name] && styles.inputError]}
        value={form[name]}
        onChangeText={v => handleChange(name, v)}
        secureTextEntry={secure}
        keyboardType={keyboard || 'default'}
        autoCapitalize="none"
        placeholderTextColor="#666"
      />
      {hint && !errors[name]  && <Text style={styles.hint}>{hint}</Text>}
      {errors[name]           && <Text style={styles.errorText}>{errors[name]}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>
          {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}

          <Field label="Username"         name="username" />
          <Field label="Email"            name="email"    keyboard="email-address" />
          <Field label="Password"         name="password" secure hint="Min 8 characters, at least 1 uppercase" />
          <Field label="Confirm Password" name="confirm"  secure />

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Register</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.switchText}>
              Already have an account? <Text style={styles.link}>Log in</Text>
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
  input:       { backgroundColor: '#111', color: '#fff', borderWidth: 1, borderColor: '#333', borderRadius: 8, padding: 12, fontSize: 16 },
  inputError:  { borderColor: '#dc3545' },
  errorText:   { color: '#dc3545', fontSize: 13, marginTop: 4 },
  hint:        { color: '#666', fontSize: 13, marginTop: 4 },
  button:      { backgroundColor: '#6C63FF', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 16 },
  buttonText:  { color: '#fff', fontWeight: '700', fontSize: 16 },
  serverError: { backgroundColor: 'rgba(220,53,69,0.15)', color: '#dc3545', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14 },
  switchText:  { marginTop: 20, textAlign: 'center', color: '#888', fontSize: 14 },
  link:        { color: '#6C63FF' },
});