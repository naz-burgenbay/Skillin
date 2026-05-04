import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { Navbar, Footer } from '../../components/Layout';

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', requirements: '', location: '', type: '', duration: '', isActive: true });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    axiosInstance.get(`/listings/${id}`)
      .then(res => {
        const l = res.data;
        setForm({
          title: l.title || '',
          description: l.description || '',
          requirements: l.requirements || '',
          location: l.location || '',
          type: l.type || '',
          duration: l.duration || '',
          isActive: l.isActive ?? true,
        });
      })
      .catch(() => navigate('/my-listings'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axiosInstance.put(`/listings/${id}`, form);
      navigate(`/listings/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing.');
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

  if (fetching) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8faff' }}>
      <div style={{ color: '#6b7280', fontSize: 16 }}>Loading...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Navbar />

      <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', padding: '48px 64px', color: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <button
            onClick={() => navigate(`/listings/${id}`)}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', marginBottom: 20, fontSize: 14, fontWeight: 500 }}
          >
            ← Back to Listing
          </button>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>Edit Listing</h1>
          <p style={{ opacity: 0.8, marginTop: 8, fontSize: 15 }}>Update your internship listing details</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '48px auto', padding: '0 64px' }}>
        <div style={{ background: 'white', borderRadius: 24, padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>

          {error && (
            <div style={{ background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 10, padding: '12px 16px', color: '#c53030', marginBottom: 24, fontSize: 14 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Title</label>
                <input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Frontend Developer Intern" required />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Location</label>
                <input style={inputStyle} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Warsaw, Remote, New York..." required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Type</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required>
                  <option value="">Select type...</option>
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Duration</label>
                <input style={inputStyle} value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 3 months, 6 months..." required />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Description</label>
              <textarea
                style={{ ...inputStyle, height: 140, resize: 'vertical' }}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the role and what students will learn..."
                required
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Requirements</label>
              <textarea
                style={{ ...inputStyle, height: 120, resize: 'vertical' }}
                value={form.requirements}
                onChange={e => setForm({ ...form, requirements: e.target.value })}
                placeholder="Required skills, qualifications, or experience..."
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={e => setForm({ ...form, isActive: e.target.checked })}
                  style={{ width: 16, height: 16, accentColor: '#4f46e5', cursor: 'pointer' }}
                />
                <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Listing is active</span>
                <span style={{ fontSize: 13, color: '#9ca3af' }}>(uncheck to hide from students)</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" disabled={loading} style={{ padding: '13px 40px', background: '#4f46e5', border: 'none', borderRadius: 10, color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.5 : 1 }}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => navigate(`/listings/${id}`)} style={{ padding: '13px 40px', background: '#f8faff', border: '1.5px solid #e5e7eb', borderRadius: 10, color: '#374151', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
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

export default EditListing;
