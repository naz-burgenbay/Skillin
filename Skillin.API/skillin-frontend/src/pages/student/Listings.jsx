import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllListings } from '../../api/listingService';
import { useAuth } from '../../context/AuthContext';
import { Navbar, Footer } from '../../components/Layout';

const COLORS = [
  'linear-gradient(135deg, #4f46e5, #7c3aed)',
  'linear-gradient(135deg, #0891b2, #2563eb)',
  'linear-gradient(135deg, #059669, #0891b2)',
  'linear-gradient(135deg, #d97706, #dc2626)',
  'linear-gradient(135deg, #7c3aed, #db2777)',
  'linear-gradient(135deg, #2563eb, #059669)',
];

const Listings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllListings()
      .then(res => { setListings(res.data); setFiltered(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(listings.filter(l =>
      l.title?.toLowerCase().includes(q) ||
      l.position?.toLowerCase().includes(q) ||
      l.location?.toLowerCase().includes(q)
    ));
  }, [search, listings]);

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', padding: '64px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}/>
        <div style={{ position: 'absolute', bottom: -80, left: 200, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}/>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <h1 style={{ fontSize: 44, fontWeight: 800, color: 'white', margin: '0 0 12px' }}>
            Internship Listings
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, marginBottom: 32 }}>
            {filtered.length} opportunities available right now
          </p>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, position or location..."
            style={{
              width: '100%', maxWidth: 560,
              padding: '15px 20px',
              borderRadius: 12, border: '1px solid rgba(255,255,255,0.3)',
              fontSize: 15, background: 'rgba(255,255,255,0.15)',
              color: 'white', outline: 'none',
              backdropFilter: 'blur(10px)',
              boxSizing: 'border-box',
            }}
                      />
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '48px auto', padding: '0 64px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#9ca3af', fontSize: 16 }}>
            Loading internships...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: 80, height: 5, background: 'linear-gradient(90deg, #4f46e5, #7c3aed)', borderRadius: 10, margin: '0 auto 32px' }}/>
            <p style={{ color: '#6b7280', fontSize: 18, fontWeight: 600 }}>No internships found</p>
            <p style={{ color: '#9ca3af', fontSize: 14, marginTop: 8 }}>Try a different search or check back later</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {filtered.map((listing, i) => (
              <div
                key={listing.id}
                style={{
                  background: 'white', borderRadius: 20,
                  overflow: 'hidden',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                  border: '1px solid #f1f5f9',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(79,70,229,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)';
                }}
              >
                {/* Card top */}
                <div style={{ background: COLORS[i % COLORS.length], padding: '28px 24px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.2)' }}/>
                    <span style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white', padding: '4px 14px',
                      borderRadius: 100, fontSize: 12, fontWeight: 600,
                    }}>
                      {listing.position || 'Internship'}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: '20px 24px 24px' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 6px', lineHeight: 1.4 }}>
                    {listing.title}
                  </h3>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 12px', fontWeight: 500 }}>
                    {listing.location}
                  </p>
                  <p style={{
                    fontSize: 13, color: '#9ca3af', margin: '0 0 20px', lineHeight: 1.7,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden'
                  }}>
                    {listing.description}
                  </p>
                  <button style={{
                    width: '100%', padding: '11px',
                    background: COLORS[i % COLORS.length],
                    border: 'none', borderRadius: 10,
                    color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer'
                  }}>
                    View & Apply
                  </button>
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

export default Listings;