import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('No verification token found.');
      return;
    }

    fetch(`/api/auth/verify-email?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      });
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {status === 'verifying' && (
          <>
            <div style={styles.icon}>⏳</div>
            <h2 style={styles.title}>Verifying your email...</h2>
            <p style={styles.subtitle}>Please wait a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={styles.icon}>✅</div>
            <h2 style={styles.title}>Email Verified!</h2>
            <p style={styles.subtitle}>Your account is ready. You can now log in.</p>
            <Link to="/login" style={styles.button}>Go to Login</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={styles.icon}>❌</div>
            <h2 style={{ ...styles.title, color: 'var(--danger)' }}>Verification Failed</h2>
            <p style={styles.errorMsg}>{message}</p>
            <Link to="/login" style={styles.button}>Back to Login</Link>
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
  button: {
    display: 'inline-block',
    marginTop: '8px',
    padding: '12px 24px',
    backgroundColor: 'var(--accent)',
    color: '#fff',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
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
};

export default VerifyEmail;