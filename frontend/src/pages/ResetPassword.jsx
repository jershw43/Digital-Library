import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import BASE_URL from '../api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: searchParams.get('token'),
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reset failed');
      navigate('/login', { state: { message: 'Password reset successful! You can now log in.' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Reset Password</h2>
        <p style={styles.subtitle}>Enter your new password below.</p>

        {error && <p style={styles.errorMsg}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>New Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={styles.input}
              placeholder="••••••••"
              required
            />
            <p style={styles.hint}>Min 8 characters, at least 1 uppercase</p>
          </div>
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p style={styles.switchText}>
          <Link to="/login">Back to Login</Link>
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
    textAlign: 'center',
  },
  title: { margin: '0 0 12px', color: 'var(--accent)' },
  subtitle: { color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' },
  fieldWrapper: { display: 'flex', flexDirection: 'column', marginBottom: '16px', textAlign: 'left' },
  label: { marginBottom: '4px', fontWeight: '500', color: 'var(--text)', fontSize: '0.9rem' },
  input: {
    padding: '10px 14px',
    fontSize: '1rem',
    border: '2px solid var(--border)',
    borderRadius: '8px',
    outline: 'none',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--input-color)',
  },
  hint: { marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' },
  button: {
    display: 'inline-block',
    marginTop: '8px',
    padding: '12px 24px',
    backgroundColor: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  errorMsg: {
    backgroundColor: 'color-mix(in srgb, var(--danger) 15%, transparent)',
    color: 'var(--danger)',
    padding: '10px 14px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '0.9rem',
  },
  switchText: { marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' },
};

export default ResetPassword;