import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BASE_URL from '../api';

const validatePassword = (password) => {
  if (password.length < 8)        return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password))   return 'Password must contain at least one uppercase letter';
  return null;
};

const Field = ({ label, name, type = 'text', value, onChange, error, hint, id }) => (
  <div className="field-wrapper">
    <label className="field-label" htmlFor={id}>{label}</label>
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className={error ? 'input-error' : ''}
      autoComplete={
        type === 'email'    ? 'email'       :
        name === 'password' ? 'new-password':
        name === 'confirm'  ? 'new-password': 'off'
      }
    />
    {hint  && !error && <p className="field-hint">{hint}</p>}
    {error &&           <p className="field-error">{error}</p>}
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm]           = useState({ username: '', email: '', password: '', confirm: '' });
  const [errors, setErrors]       = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading]     = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = 'Username is required';
    if (!form.email.trim())    newErrors.email    = 'Email is required';
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
      console.log('API URL:', BASE_URL);
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          username: form.username,
          email:    form.email,
          password: form.password,
        }),
      });

      const text = await res.text();
      console.log('Response:', text);
      if (!text) { setServerError('Server returned an empty response'); return; }

      const data = JSON.parse(text);
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      navigate('/login', { state: { message: 'Account created! Please check your email to verify your account.' } });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h2 style={{ textAlign: 'center', color: 'var(--accent)', margin: '0 0 1.5rem' }}>
          Create Account
        </h2>

        {serverError && (
          <p className="alert alert-error">{serverError}</p>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <Field
            id="reg-username"
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
          />
          <Field
            id="reg-email"
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Field
            id="reg-password"
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            hint="Min 8 characters, at least 1 uppercase"
          />
          <Field
            id="reg-confirm"
            label="Confirm Password"
            name="confirm"
            type="password"
            value={form.confirm}
            onChange={handleChange}
            error={errors.confirm}
          />

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p className="switch-text">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;