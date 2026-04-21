import { useState } from 'react';
import { Link } from 'react-router-dom';
import BASE_URL from '../api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {status === 'success' ? (
          <>
            <div style={styles.icon}>📧</div>
            <h2 style={styles.title}>Check your email</h2>
            <p style={styles.subtitle}>We sent a password reset link to <strong>{email}</strong>. It expires in 1 hour.</p>
            <Link to="/login" style={styles.button}>Back to Login</Link>
          </>
        ) : (
          <>
            <h2 style={styles.title}>Forgot Password</h2>
            <p style={styles.subtitle}>Enter your email and we'll send you a reset link.</p>

            {status === 'error' && (
              <p style={styles.errorMsg}>{message}</p>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={styles.fieldWrapper}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <p style={styles.switchText}>
              <Link to="/login">Back to Login</Link>
            </p>
          </>
        )}
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
  icon: { fontSize: '3rem', marginBottom: '16px' },
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

export default ForgotPassword;