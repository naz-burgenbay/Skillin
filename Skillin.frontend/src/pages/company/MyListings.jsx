import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { Navbar, Footer } from '../../components/Layout';

const COLORS = [
  'linear-gradient(135deg, #4f46e5, #7c3aed)',
  'linear-gradient(135deg, #0891b2, #2563eb)',
  'linear-gradient(135deg, #059669, #0891b2)',
  'linear-gradient(135deg, #d97706, #dc2626)',
  'linear-gradient(135deg, #7c3aed, #db2777)',
  'linear-gradient(135deg, #2563eb, #059669)',
];

const MyListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/listings/mine')
      .then(res => setListings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await axiosInstance.delete(`/listings/${id}`);
      setListings(l => l.filter(x => x.id !== id));
    } catch {
      alert('Failed to delete listing.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Navbar />

      <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', padding: '48px 64px', color: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>My Internships</h1>
            <p style={{ opacity: 0.8, marginTop: 8, fontSize: 15 }}>{listings.length} listing{listings.length !== 1 ? 's' : ''} posted</p>
          </div>
          <button
            onClick={() => navigate('/listings/create')}
            style={{ padding: '12px 28px', background: 'white', border: 'none', borderRadius: 10, color: '#4f46e5', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
          >
            + Post New Internship
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '48px auto', padding: '0 64px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#9ca3af', fontSize: 16 }}>Loading...</div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: '#6b7280', fontSize: 18, fontWeight: 600 }}>No internships posted yet.</p>
            <button
              onClick={() => navigate('/listings/create')}
              style={{ marginTop: 20, padding: '12px 28px', background: '#4f46e5', border: 'none', borderRadius: 10, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              Post Your First Internship
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {listings.map((listing, i) => (
              <div key={listing.id} style={{
                background: 'white', borderRadius: 20,
                overflow: 'hidden',
                boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                border: '1px solid #f1f5f9',
                cursor: 'pointer',
              }}
                onClick={() => navigate(`/listings/${listing.id}`)}
              >
                <div style={{ background: COLORS[i % COLORS.length], padding: '28px 24px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.2)' }} />
                    <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '4px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600 }}>
                      {listing.type || 'Internship'}
                    </span>
                  </div>
                </div>
                <div style={{ padding: '20px 24px 24px' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 6px', lineHeight: 1.4 }}>{listing.title}</h3>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 4px', fontWeight: 500 }}>{listing.location}</p>
                  {listing.duration && <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 12px' }}>⏱ {listing.duration}</p>}
                  <p style={{
                    fontSize: 13, color: '#9ca3af', margin: '0 0 20px', lineHeight: 1.7,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                  }}>
                    {listing.description}
                  </p>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: listing.isActive ? '#16a34a' : '#dc2626',
                      background: listing.isActive ? '#f0fdf4' : '#fff5f5',
                      padding: '3px 10px', borderRadius: 100
                    }}>
                      {listing.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>
                      {listing.applicationCount} applicant{listing.applicationCount !== 1 ? 's' : ''}
                    </span>
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/listings/${listing.id}/edit`); }}
                      style={{ background: '#f5f3ff', border: '1px solid #c4b5fd', color: '#4f46e5', padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(listing.id); }}
                      style={{ background: '#fff5f5', border: '1px solid #feb2b2', color: '#c53030', padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
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

export default MyListings;
