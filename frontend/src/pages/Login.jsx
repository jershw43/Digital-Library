import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.message;
  const returnTo = location.state?.from || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      login(data.token, data.username);
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>

        {successMessage && <p style={styles.successMsg}>{successMessage}</p>}
        {error && <p style={styles.errorMsg}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
              autoComplete="email"
            />
          </div>
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p style={styles.switchText}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: { marginTop: '100px', display: 'flex', justifyContent: 'center', padding: '20px' },
  card: {
    backgroundColor: 'var(--surface)',
    borderRadius: '12px',
    boxShadow: '0 4px 12px var(--shadow)',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid var(--border)',
  },
  title: { margin: '0 0 24px', color: 'var(--accent)', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column' },
  fieldWrapper: { display: 'flex', flexDirection: 'column', marginBottom: '16px' },
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
  errorMsg: {
    backgroundColor: 'color-mix(in srgb, var(--danger) 15%, transparent)',
    color: 'var(--danger)',
    padding: '10px 14px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '0.9rem',
  },
  successMsg: {
    backgroundColor: '#e6f4ea',
    color: '#2e7d32',
    padding: '10px 14px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '0.9rem',
  },
  switchText: { marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' },
};

export default Login;
