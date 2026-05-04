import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { Navbar, Footer } from '../../components/Layout';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const isCompany = role === 'Company';
  const [listing, setListing] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [cvError, setCvError] = useState('');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axiosInstance.get(`/listings/${id}`)
      .then(res => setListing(res.data))
      .catch(() => navigate('/listings'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    setCvError(''); setError(''); setSuccess('');
    if (!cvFile) { setCvError('Please upload your CV before submitting.'); return; }
    setApplying(true);
    try {
      const form = new FormData();
      form.append('listingId', id);
      form.append('coverLetter', coverLetter);
      form.append('cv', cvFile);
      await axiosInstance.post('/applications', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Application submitted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowed.includes(ext)) { setCvError('Only PDF, DOC, or DOCX files are accepted.'); setCvFile(null); return; }
    if (file.size > 10 * 1024 * 1024) { setCvError('File must be smaller than 10 MB.'); setCvFile(null); return; }
    setCvError('');
    setCvFile(file);
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

  if (!listing) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Navbar />

      <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', padding: '48px 64px', color: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <button
            onClick={() => navigate(isCompany ? '/my-listings' : '/listings')}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', marginBottom: 20, fontSize: 14, fontWeight: 500 }}
          >
            ← {isCompany ? 'My Listings' : 'Back to Listings'}
          </button>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>{listing.title}</h1>
          <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ background: 'rgba(255,255,255,0.25)', padding: '5px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
              {listing.companyName}
            </span>
            {listing.location && (
              <span style={{ background: 'rgba(255,255,255,0.15)', padding: '5px 16px', borderRadius: 100, fontSize: 13 }}>
                📍 {listing.location}
              </span>
            )}
            {listing.type && (
              <span style={{ background: 'rgba(255,255,255,0.15)', padding: '5px 16px', borderRadius: 100, fontSize: 13 }}>
                {listing.type}
              </span>
            )}
            {listing.duration && (
              <span style={{ background: 'rgba(255,255,255,0.15)', padding: '5px 16px', borderRadius: 100, fontSize: 13 }}>
                ⏱ {listing.duration}
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '48px auto', padding: '0 64px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Internship details card */}
        <div style={{ background: 'white', borderRadius: 24, padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginTop: 0, marginBottom: 16 }}>About this internship</h2>
          <p style={{ color: '#374151', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>{listing.description}</p>

          {listing.requirements && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginTop: 32, marginBottom: 16 }}>Requirements</h2>
              <p style={{ color: '#374151', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>{listing.requirements}</p>
            </>
          )}
        </div>

        {/* Company: Edit button */}
        {isCompany && (
          <div style={{ background: 'white', borderRadius: 24, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', display: 'flex', gap: 12 }}>
            <button
              onClick={() => navigate(`/listings/${id}/edit`)}
              style={{ padding: '12px 32px', background: '#4f46e5', border: 'none', borderRadius: 10, color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
            >
              Edit Listing
            </button>
          </div>
        )}

        {/* Apply card — students only */}
        {!isCompany && <div style={{ background: 'white', borderRadius: 24, padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginTop: 0, marginBottom: 20 }}>Apply for this position</h2>

          {success && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 16px', color: '#166534', marginBottom: 20, fontSize: 14, fontWeight: 500 }}>
              {success}
            </div>
          )}
          {error && (
            <div style={{ background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 10, padding: '12px 16px', color: '#c53030', marginBottom: 20, fontSize: 14 }}>
              {error}
            </div>
          )}

          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
            CV / Resume <span style={{ color: '#dc2626', fontWeight: 400 }}>*</span>
            <span style={{ color: '#9ca3af', fontWeight: 400, marginLeft: 6 }}>PDF, DOC or DOCX — max 10 MB</span>
          </label>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', border: `1.5px dashed ${cvError ? '#dc2626' : cvFile ? '#4f46e5' : '#e5e7eb'}`,
              borderRadius: 10, cursor: success ? 'default' : 'pointer',
              background: cvFile ? '#f5f3ff' : '#fafafa', transition: 'border-color 0.15s'
            }}>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} disabled={!!success} style={{ display: 'none' }} />
              <span style={{ fontSize: 20 }}>📎</span>
              <span style={{ fontSize: 14, color: cvFile ? '#4f46e5' : '#9ca3af', fontWeight: cvFile ? 600 : 400 }}>
                {cvFile ? cvFile.name : 'Click to upload your CV'}
              </span>
              {cvFile && !success && (
                <button onClick={e => { e.preventDefault(); setCvFile(null); }} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: 16 }}>✕</button>
              )}
            </label>
            {cvError && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 6, marginBottom: 0 }}>{cvError}</p>}
          </div>

          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
            Cover Letter <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            value={coverLetter}
            onChange={e => setCoverLetter(e.target.value)}
            disabled={!!success}
            placeholder="Tell the company why you're a great fit for this role..."
            style={{ ...inputStyle, height: 160, resize: 'vertical' }}
          />
          <button
            onClick={handleApply}
            disabled={applying || !!success}
            style={{
              marginTop: 16, padding: '13px 40px',
              background: success ? '#16a34a' : '#4f46e5',
              border: 'none', borderRadius: 10,
              color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer',
              opacity: applying ? 0.7 : 1
            }}
          >
            {applying ? 'Submitting...' : success ? '✓ Applied' : 'Submit Application'}
          </button>
        </div>
        }

      </div>
      <Footer />
    </div>
  );
};

export default ListingDetail;
