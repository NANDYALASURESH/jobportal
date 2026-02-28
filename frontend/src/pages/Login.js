import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      navigate(data.role === 'Admin' ? '/admin/dashboard' : '/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', margin: '0 1rem' }}>
        <div className="card-body">
          <div className="text-center mb-3">
            <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>🔐</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Welcome Back</h1>
            <p className="text-muted" style={{ fontSize: '.9rem' }}>Sign in to your account</p>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          {/* Demo credentials */}
          <div className="alert alert-info" style={{ fontSize: '.82rem' }}>
            <div><strong>Demo Admin:</strong> admin@jobportal.com / Admin@123</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-2" style={{ fontSize: '.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
