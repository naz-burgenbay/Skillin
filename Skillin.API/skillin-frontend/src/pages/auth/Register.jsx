import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../api/authService';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ ...form, role: Number(form.role) });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    border: '1.5px solid #e2e8f0',
    borderRadius: 10, fontSize: 15,
    outline: 'none', boxSizing: 'border-box',
    color: '#1a202c', background: '#fff',
    transition: 'border 0.2s'
  };

  const labelStyle = {
    fontSize: 13, fontWeight: 600,
    color: '#4a5568', display: 'block', marginBottom: 6
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: '#f7f8fc',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Left panel */}
      <div style={{
        width: '45%', background: 'linear-gradient(135deg, #6c63ff, #302b63)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: 48, color: 'white'
      }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, margin: 0 }}>Skillin</h1>
        <p style={{ fontSize: 18, opacity: 0.8, marginTop: 16, textAlign: 'center', maxWidth: 300 }}>
          Connect with top companies and launch your career
        </p>
        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {['Create your profile', 'Browse internships', 'Apply with one click'].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700
              }}>{i + 1}</div>
              <span style={{ fontSize: 15, opacity: 0.9 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: 48
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1a202c', margin: 0 }}>
            Create account
          </h2>
          <p style={{ color: '#718096', marginTop: 8, marginBottom: 32 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#6c63ff', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>

          {error && (
            <div style={{
              background: '#fff5f5', border: '1px solid #feb2b2',
              borderRadius: 10, padding: '12px 16px',
              color: '#c53030', marginBottom: 20, fontSize: 14
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>I am a</label>
              <div style={{ display: 'flex', gap: 12 }}>
                {[{ label: 'Student', value: 0, icon: '🎓' }, { label: 'Company', value: 1, icon: '🏢' }].map(r => (
                  <button key={r.value} type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    style={{
                      flex: 1, padding: '12px',
                      background: form.role === r.value ? '#6c63ff' : '#fff',
                      border: `1.5px solid ${form.role === r.value ? '#6c63ff' : '#e2e8f0'}`,
                      borderRadius: 10, fontSize: 14, fontWeight: 600,
                      color: form.role === r.value ? 'white' : '#4a5568',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}>
                    {r.icon} {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Email address</label>
              <input type="email" name="email" value={form.email} required
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={inputStyle} placeholder="you@example.com" />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Password</label>
              <input type="password" name="password" value={form.password} required
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={inputStyle} placeholder="Min. 8 characters" />
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px',
              background: '#6c63ff', border: 'none',
              borderRadius: 10, color: 'white',
              fontSize: 16, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
