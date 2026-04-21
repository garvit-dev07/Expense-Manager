import { Link } from 'react-router-dom';
import { useState } from 'react';
import { request } from '../api.js';

const Register = ({ onAuth }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await request('/register', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      onAuth(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-visual" aria-hidden="true">
          <div className="brand-mark">EM</div>
          <div className="floating-card card-one">
            <span>Bills</span>
            <strong>INR 2,100</strong>
          </div>
          <div className="floating-card card-two">
            <span>Health</span>
            <strong>INR 560</strong>
          </div>
          <div className="pulse-ring" />
          <div className="mini-bars">
            <i style={{ height: '46%' }} />
            <i style={{ height: '72%' }} />
            <i style={{ height: '58%' }} />
            <i style={{ height: '86%' }} />
            <i style={{ height: '64%' }} />
          </div>
        </div>

        <div className="auth-panel">
          <div>
            <p className="eyebrow">Expense Manager</p>
            <h1>Create account</h1>
            <p className="muted">Track personal spending securely with your own login.</p>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <label>
              Name
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={updateField}
                required
              />
            </label>

            <label>
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                required
              />
            </label>

            <label>
              Password
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={updateField}
                required
              />
            </label>

            {error && <p className="error">{error}</p>}

            <button type="submit" disabled={loading}>
              <span>{loading ? 'Registering...' : 'Register'}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h12m-5-5 5 5-5 5" />
              </svg>
            </button>
          </form>

          <p className="switch-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;