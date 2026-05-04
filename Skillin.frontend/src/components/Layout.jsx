import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const role = localStorage.getItem('role');

  return (
    <nav style={{
      padding: '0 64px', height: 70,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      position: 'sticky', top: 0, zIndex: 100
    }}>
      <span onClick={() => navigate('/home')} style={{ fontSize: 24, fontWeight: 800, color: '#4f46e5', cursor: 'pointer' }}>Skillin</span>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {role === 'Student' && <>
          <button onClick={() => navigate('/listings')} style={{ padding: '8px 16px', background: 'transparent', border: 'none', color: '#374151', fontSize: 14, fontWeight: 500, cursor: 'pointer', borderRadius: 8 }}>Internships</button>
          <button onClick={() => navigate('/my-applications')} style={{ padding: '8px 16px', background: 'transparent', border: 'none', color: '#374151', fontSize: 14, fontWeight: 500, cursor: 'pointer', borderRadius: 8 }}>My Applications</button>
          <button onClick={() => navigate('/profile/student')} style={{ padding: '8px 16px', background: 'transparent', border: 'none', color: '#374151', fontSize: 14, fontWeight: 500, cursor: 'pointer', borderRadius: 8 }}>My Profile</button>
        </>}
        {role === 'Company' && <>
          <button onClick={() => navigate('/my-listings')} style={{ padding: '8px 16px', background: 'transparent', border: 'none', color: '#374151', fontSize: 14, cursor: 'pointer', borderRadius: 8 }}>My Listings</button>
          <button onClick={() => navigate('/listings/create')} style={{ padding: '8px 16px', background: 'transparent', border: 'none', color: '#374151', fontSize: 14, cursor: 'pointer', borderRadius: 8 }}>Post Internship</button>
          <button onClick={() => navigate('/applications')} style={{ padding: '8px 16px', background: 'transparent', border: 'none', color: '#374151', fontSize: 14, cursor: 'pointer', borderRadius: 8 }}>Applications</button>
          <button onClick={() => navigate('/profile/company')} style={{ padding: '8px 16px', background: 'transparent', border: 'none', color: '#374151', fontSize: 14, cursor: 'pointer', borderRadius: 8 }}>Profile</button>
        </>}
        <button onClick={() => { logout(); navigate('/'); }} style={{ padding: '9px 22px', background: '#4f46e5', border: 'none', borderRadius: 8, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginLeft: 8 }}>Logout</button>
      </div>
    </nav>
  );
};

export const Footer = () => (
  <footer style={{ background: '#0f172a', color: 'white', padding: '48px 64px', marginTop: 80 }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#4f46e5', marginBottom: 8 }}>Skillin</div>
        <div style={{ color: '#94a3b8', fontSize: 14 }}>Your career starts here.</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 12 }}>Contact us</div>
        <div style={{ color: 'white', fontSize: 15, marginBottom: 8, fontWeight: 500 }}>+48 666 267 371</div>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: '#818cf8', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>Instagram</a>
      </div>
    </div>
    <div style={{ borderTop: '1px solid #1e293b', marginTop: 32, paddingTop: 24, textAlign: 'center', color: '#475569', fontSize: 13 }}>
      © 2026 Skillin. All rights reserved.
    </div>
  </footer>
);