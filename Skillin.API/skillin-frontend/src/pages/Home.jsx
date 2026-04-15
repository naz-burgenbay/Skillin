import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar, Footer } from '../components/Layout';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || localStorage.getItem('role');

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ display: 'flex', alignItems: 'center', maxWidth: 1200, margin: '0 auto', padding: '80px 64px', gap: 80 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'inline-block', padding: '6px 14px', background: '#ede9fe', borderRadius: 100, fontSize: 13, color: '#7c3aed', fontWeight: 600, marginBottom: 20 }}>
            Your Career Starts Here
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.15 }}>
            Find Your Dream<br />
            <span style={{ color: '#4f46e5' }}>Internship</span>
          </h1>
          <p style={{ fontSize: 17, color: '#6b7280', marginTop: 20, marginBottom: 36, lineHeight: 1.7, maxWidth: 420 }}>
            Connect with top companies, build real skills, and launch your career with Skillin.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => navigate('/listings')} style={{ padding: '14px 32px', background: '#4f46e5', border: 'none', borderRadius: 10, color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
              Browse Internships
            </button>
            <button onClick={() => navigate(role === 'Company' ? '/profile/company' : '/profile/student')} style={{ padding: '14px 32px', background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 10, color: '#374151', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
              My Profile
            </button>
          </div>
          <div style={{ display: 'flex', gap: 40, marginTop: 48 }}>
            {[{ v: '500+', l: 'Companies' }, { v: '2K+', l: 'Internships' }, { v: '10K+', l: 'Students' }].map(s => (
              <div key={s.l}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#111827' }}>{s.v}</div>
                <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ width: '100%', height: 420, borderRadius: 24, overflow: 'hidden', boxShadow: '0 25px 60px rgba(79,70,229,0.15)' }}>
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" alt="team" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ position: 'absolute', bottom: -20, left: -20, background: 'white', borderRadius: 16, padding: '16px 20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: '#4f46e5' }}/>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>New match found!</div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>Frontend Intern at Google</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div style={{ background: 'white', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '60px 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8, textAlign: 'center' }}>Quick Actions</h2>
          <p style={{ color: '#9ca3af', textAlign: 'center', marginBottom: 40, fontSize: 15 }}>Everything you need in one place</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { title: 'Browse Internships', desc: 'Explore hundreds of opportunities from top companies worldwide.', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80', path: '/listings' },
              { title: 'My Profile', desc: 'Complete your profile and upload your CV to stand out.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', path: role === 'Company' ? '/profile/company' : '/profile/student' },
              { title: 'Applications', desc: 'Track all your applications and monitor their status.', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80', path: '/applications' },
            ].map(card => (
              <div key={card.title} onClick={() => navigate(card.path)} style={{ background: '#f8faff', borderRadius: 20, overflow: 'hidden', border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ height: 180, overflow: 'hidden' }}>
                  <img src={card.img} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '20px 24px 24px' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>{card.title}</h3>
                  <p style={{ fontSize: 14, color: '#9ca3af', margin: 0, lineHeight: 1.6 }}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;