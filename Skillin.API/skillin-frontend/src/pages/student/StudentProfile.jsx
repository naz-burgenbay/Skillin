import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { Navbar, Footer } from '../../components/Layout';

const StudentProfile = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', bio: '', skills: '', universityName: '' });
  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axiosInstance.get('/students/me')
      .then(res => { setForm(res.data); setProfileId(res.data.id); })
      .catch(() => setProfileId(null))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      if (profileId) {
        await axiosInstance.put(`/students/${profileId}`, form);
      } else {
        const res = await axiosInstance.post('/students', form);
        setProfileId(res.data.id);
      }
      setSuccess('Profile saved successfully!');
    } catch {
      setError('Failed to save profile.');
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    border: '1.5px solid #e5e7eb', borderRadius: 10,
    fontSize: 15, outline: 'none',
    color: '#111827', background: '#fff',
    boxSizing: 'border-box', fontFamily: 'Inter, sans-serif'
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8faff' }}>
      <div style={{ color: '#6b7280', fontSize: 16 }}>Loading...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Navbar />

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', padding: '48px 64px', color: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>My Profile</h1>
          <p style={{ opacity: 0.8, marginTop: 8, fontSize: 15 }}>Complete your profile to stand out to recruiters</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '48px auto', padding: '0 64px' }}>
        <div style={{ background: 'white', borderRadius: 24, padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>

          {success && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 16px', color: '#166534', marginBottom: 24, fontSize: 14, fontWeight: 500 }}>
              {success}
            </div>
          )}
          {error && (
            <div style={{ background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 10, padding: '12px 16px', color: '#c53030', marginBottom: 24, fontSize: 14 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Full Name</label>
                <input style={inputStyle} value={form.fullName || ''} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="John Doe" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>University</label>
                <input style={inputStyle} value={form.universityName || ''} onChange={e => setForm({ ...form, universityName: e.target.value })} placeholder="MIT, Stanford..." />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Skills</label>
              <input style={inputStyle} value={form.skills || ''} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="React, Python, SQL, Figma..." />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Bio</label>
              <textarea
                style={{ ...inputStyle, height: 120, resize: 'vertical' }}
                value={form.bio || ''} onChange={e => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell companies about yourself..."
              />
            </div>

            <button type="submit" style={{ padding: '13px 40px', background: '#4f46e5', border: 'none', borderRadius: 10, color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              Save Changes
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentProfile;