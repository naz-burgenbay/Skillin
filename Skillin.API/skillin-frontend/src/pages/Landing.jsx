import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Navbar */}
      <nav style={{
        padding: '0 64px', height: 70,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }}>
        <span style={{ fontSize: 24, fontWeight: 800, color: '#4f46e5' }}>Skillin</span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => navigate('/login')} style={{ padding: '9px 22px', background: 'transparent', border: '1.5px solid #e5e7eb', borderRadius: 8, color: '#374151', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Sign In
          </button>
          <button onClick={() => navigate('/register')} style={{ padding: '9px 22px', background: '#4f46e5', border: 'none', borderRadius: 8, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ display: 'flex', alignItems: 'center', maxWidth: 1200, margin: '0 auto', padding: '100px 64px', gap: 80 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'inline-block', padding: '6px 14px', background: '#ede9fe', borderRadius: 100, fontSize: 13, color: '#7c3aed', fontWeight: 600, marginBottom: 24 }}>
            The #1 Internship Platform
          </div>
          <h1 style={{ fontSize: 58, fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.1 }}>
            Find Your Dream<br />
            <span style={{ color: '#4f46e5' }}>Internship</span><br />
            Today
          </h1>
          <p style={{ fontSize: 18, color: '#6b7280', marginTop: 24, marginBottom: 40, lineHeight: 1.7, maxWidth: 440 }}>
            Connect with top companies, build real-world skills, and launch your career with Skillin.
          </p>
          <div style={{ display: 'flex', gap: 14 }}>
            <button onClick={() => navigate('/register')} style={{ padding: '15px 36px', background: '#4f46e5', border: 'none', borderRadius: 12, color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 24px rgba(79,70,229,0.3)' }}>
              Get Started Free
            </button>
            <button onClick={() => navigate('/login')} style={{ padding: '15px 36px', background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 12, color: '#374151', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
              Sign In
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 48, marginTop: 56, paddingTop: 40, borderTop: '1px solid #f1f5f9' }}>
            {[{ v: '500+', l: 'Companies' }, { v: '2,000+', l: 'Internships' }, { v: '10,000+', l: 'Students' }].map(s => (
              <div key={s.l}>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#111827' }}>{s.v}</div>
                <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right image */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ width: '100%', height: 480, borderRadius: 28, overflow: 'hidden', boxShadow: '0 30px 80px rgba(79,70,229,0.18)' }}>
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" alt="team" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {/* Floating card 1 */}
          <div style={{ position: 'absolute', top: 40, left: -40, background: 'white', borderRadius: 16, padding: '14px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 20, height: 20, borderRadius: 5, background: '#4f46e5' }}/>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>500+ Companies</div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>hiring right now</div>
            </div>
          </div>
          {/* Floating card 2 */}
          <div style={{ position: 'absolute', bottom: 40, left: -40, background: 'white', borderRadius: 16, padding: '14px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#22c55e' }}/>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>New match found!</div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>Frontend Intern at Google</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ background: 'white', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '80px 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#111827', textAlign: 'center', margin: '0 0 12px' }}>
            Everything you need
          </h2>
          <p style={{ color: '#9ca3af', textAlign: 'center', fontSize: 16, marginBottom: 56 }}>
            One platform for students and companies
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {[
              { title: 'For Students', desc: 'Create your profile, browse hundreds of internships, and apply with one click. Build your career from day one.', img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80', color: '#ede9fe' },
              { title: 'For Companies', desc: 'Post internship listings, discover talented students, and manage all applications in one place.', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80', color: '#dbeafe' },
              { title: 'Easy & Fast', desc: 'Simple, intuitive platform designed for early career opportunities. Get started in minutes.', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80', color: '#dcfce7' },
            ].map(f => (
              <div key={f.title} style={{ background: '#f8faff', borderRadius: 20, overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                <div style={{ height: 200, overflow: 'hidden' }}>
                  <img src={f.img} alt={f.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '24px 28px 28px' }}>
                  <div style={{ display: 'inline-block', padding: '4px 12px', background: f.color, borderRadius: 100, fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 12 }}>
                    {f.title}
                  </div>
                  <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', padding: '80px 64px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, color: 'white', margin: '0 0 16px' }}>
          Ready to start your journey?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 17, marginBottom: 40 }}>
          Join thousands of students and companies already on Skillin.
        </p>
        <button onClick={() => navigate('/register')} style={{ padding: '16px 48px', background: 'white', border: 'none', borderRadius: 12, color: '#4f46e5', fontSize: 17, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          Get Started Free
        </button>
      </div>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: 'white', padding: '48px 64px' }}>
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
    </div>
  );
};

export default Landing;