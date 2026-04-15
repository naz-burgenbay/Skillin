import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { Navbar, Footer } from '../../components/Layout';

const statusStyle = (status) => {
  if (status === 'Approved') return { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' };
  if (status === 'Rejected') return { background: '#fff5f5', color: '#c53030', border: '1px solid #feb2b2' };
  return { background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a' };
};

const Applications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/applications')
      .then(res => setApplications(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Navbar />

      <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', padding: '48px 64px', color: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>Applications</h1>
          <p style={{ opacity: 0.8, marginTop: 8, fontSize: 15 }}>
            {applications.length} applications received
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '48px auto', padding: '0 64px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#9ca3af' }}>Loading...</div>
        ) : applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: '#ede9fe', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: 10 }}/>
            </div>
            <p style={{ color: '#9ca3af', fontSize: 18, fontWeight: 500 }}>No applications yet.</p>
            <p style={{ color: '#d1d5db', fontSize: 14 }}>Post an internship to start receiving applications.</p>
            <button onClick={() => navigate('/listings/create')} style={{ marginTop: 20, padding: '12px 28px', background: '#4f46e5', border: 'none', borderRadius: 10, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Post Internship
            </button>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: 24, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', padding: '16px 28px', background: '#f8faff', borderBottom: '1px solid #f1f5f9' }}>
              {['Student', 'Listing', 'Position', 'Date', 'Status'].map(h => (
                <span key={h} style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
              ))}
            </div>

            {/* Table rows */}
            {applications.map((app, i) => (
              <div key={app.id} style={{
                display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
                padding: '20px 28px', alignItems: 'center',
                borderBottom: i < applications.length - 1 ? '1px solid #f9fafb' : 'none',
                transition: 'background 0.15s'
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8faff'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                    {app.studentName || app.student?.fullName || 'Student'}
                  </div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                    {app.studentEmail || ''}
                  </div>
                </div>
                <div style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>
                  {app.listingTitle || app.listing?.title || 'Listing'}
                </div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>
                  {app.position || app.listing?.position || '—'}
                </div>
                <div style={{ fontSize: 13, color: '#9ca3af' }}>
                  {new Date(app.appliedAt || app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div>
                  <span style={{
                    ...statusStyle(app.status),
                    padding: '4px 12px', borderRadius: 100,
                    fontSize: 12, fontWeight: 600
                  }}>
                    {app.status || 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Applications;