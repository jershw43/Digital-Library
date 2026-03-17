import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const validatePassword = (password) => {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  return null;
};

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = 'Username is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    const pwError = validatePassword(form.password);
    if (pwError) newErrors.password = pwError;
    if (form.password !== form.confirm) newErrors.confirm = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, email: form.email, password: form.password }),
      });
      const text = await res.text();
      if (!text) { setServerError('Server returned an empty response'); return; }
      const data = JSON.parse(text);
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      navigate('/login', { state: { message: 'Account created! Please log in.' } });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        {serverError && <p style={styles.serverError}>{serverError}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <Field label="Username" name="username" value={form.username} onChange={handleChange} error={errors.username} />
          <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
          <Field label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} hint="Min 8 characters, at least 1 uppercase" />
          <Field label="Confirm Password" name="confirm" type="password" value={form.confirm} onChange={handleChange} error={errors.confirm} />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p style={styles.switchText}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

const Field = ({ label, name, type = 'text', value, onChange, error, hint }) => (
  <div style={styles.fieldWrapper}>
    <label style={styles.label}>{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      style={{ ...styles.input, ...(error ? styles.inputError : {}) }}
    />
    {hint && !error && <p style={styles.hint}>{hint}</p>}
    {error && <p style={styles.errorText}>{error}</p>}
  </div>
);

const styles = {
  page: { marginTop: '100px', display: 'flex', justifyContent: 'center', padding: '20px' },
  card: {
    backgroundColor: 'var(--surface)',
    borderRadius: '12px',
    boxShadow: '0 4px 12px var(--shadow)',
    padding: '40px',
    width: '100%',
    maxWidth: '440px',
    border: '1px solid var(--border)',
  },
  title: { margin: '0 0 24px', color: 'var(--accent)', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '4px' },
  fieldWrapper: { display: 'flex', flexDirection: 'column', marginBottom: '12px' },
  label: { marginBottom: '4px', fontWeight: '500', color: 'var(--text)', fontSize: '0.9rem' },
  input: {
    padding: '10px 14px',
    fontSize: '1rem',
    border: '2px solid var(--border)',
    borderRadius: '8px',
    outline: 'none',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--input-color)',
    transition: 'border-color 0.2s',
  },
  inputError: { borderColor: 'var(--danger)' },
  errorText: { margin: '4px 0 0', color: 'var(--danger)', fontSize: '0.82rem' },
  hint: { margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.82rem' },
  button: {
    marginTop: '8px',
    padding: '12px',
    backgroundColor: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  serverError: {
    backgroundColor: 'color-mix(in srgb, var(--danger) 15%, transparent)',
    color: 'var(--danger)',
    padding: '10px 14px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '0.9rem',
  },
  switchText: { marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' },
};

export default Register;
