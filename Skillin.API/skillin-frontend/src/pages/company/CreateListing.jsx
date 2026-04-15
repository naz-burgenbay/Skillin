import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { Navbar, Footer } from '../../components/Layout';

const CreateListing = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', location: '', position: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axiosInstance.post('/listings', form);
      navigate('/home');
    } catch {
      setError('Failed to create listing.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    border: '1.5px solid #e5e7eb', borderRadius: 10,
    fontSize: 15, outline: 'none',
    color: '#111827', background: '#fff',
    boxSizing: 'border-box', fontFamily: 'Inter, sans-serif'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Navbar />

      <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', padding: '48px 64px', color: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>Post Internship</h1>
          <p style={{ opacity: 0.8, marginTop: 8, fontSize: 15 }}>Create a new internship listing to attract top student talent</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '48px auto', padding: '0 64px' }}>
        <div style={{ background: 'white', borderRadius: 24, padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>

          {error && <div style={{ background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 10, padding: '12px 16px', color: '#c53030', marginBottom: 24, fontSize: 14 }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Title</label>
                <input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Frontend Developer Intern" required />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Position</label>
                <input style={inputStyle} value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} placeholder="Frontend, Backend, Design..." required />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Location</label>
              <input style={inputStyle} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Warsaw, Remote, New York..." required />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Description</label>
              <textarea
                style={{ ...inputStyle, height: 160, resize: 'vertical' }}
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the role, requirements, and what students will learn..."
                required
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" disabled={loading} style={{ padding: '13px 40px', background: '#4f46e5', border: 'none', borderRadius: 10, color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Publishing...' : 'Publish Listing'}
              </button>
              <button type="button" onClick={() => navigate('/home')} style={{ padding: '13px 40px', background: '#f8faff', border: '1.5px solid #e5e7eb', borderRadius: 10, color: '#374151', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateListing;