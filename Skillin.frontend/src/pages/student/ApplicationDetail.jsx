import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { Navbar, Footer } from '../../components/Layout';

const statusColor = (status) => {
  if (status === 'Approved') return { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' };
  if (status === 'Rejected') return { bg: '#fff5f5', text: '#c53030', border: '#feb2b2' };
  return { bg: '#fffbeb', text: '#92400e', border: '#fde68a' };
};

const ApplicationDetail = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const isCompany = role === 'Company';

  const [application, setApplication] = useState(state?.application || null);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(!state?.application);

  // Edit state (student only)
  const [editing, setEditing] = useState(false);
  const [editCoverLetter, setEditCoverLetter] = useState('');
  const [editCvFile, setEditCvFile] = useState(null);
  const [editCvError, setEditCvError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');

  // Status update state (company only)
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState('');

  // Fetch application if not in route state
  useEffect(() => {
    if (!application) {
      const endpoint = isCompany ? '/applications' : '/applications/my';
      axiosInstance.get(endpoint)
        .then(res => {
          const found = res.data.find(a => a.id === id);
          setApplication(found || null);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Load listing details
  useEffect(() => {
    if (application?.listingId) {
      axiosInstance.get(`/listings/${application.listingId}`)
        .then(res => setListing(res.data))
        .catch(console.error);
    }
  }, [application]);

  const openEdit = () => {
    setEditCoverLetter(application.coverLetter || '');
    setEditCvFile(null);
    setEditCvError('');
    setEditError('');
    setEditing(true);
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowed.includes(ext)) { setEditCvError('Only PDF, DOC, or DOCX files are accepted.'); setEditCvFile(null); return; }
    if (file.size > 10 * 1024 * 1024) { setEditCvError('File must be smaller than 10 MB.'); setEditCvFile(null); return; }
    setEditCvError('');
    setEditCvFile(file);
  };

  const handleSaveEdit = async () => {
    setEditError('');
    setSaving(true);
    try {
      const form = new FormData();
      form.append('coverLetter', editCoverLetter);
      if (editCvFile) form.append('cv', editCvFile);
      const res = await axiosInstance.put(`/applications/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setApplication(res.data);
      setEditing(false);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    setStatusError('');
    setUpdatingStatus(true);
    try {
      const res = await axiosInstance.patch(`/applications/${id}/status`, { status });
      setApplication(prev => ({ ...prev, status: res.data.status }));
    } catch (err) {
      setStatusError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingStatus(false);
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

  if (!application) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8faff' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: 16 }}>Application not found.</p>
        <button
          onClick={() => navigate(isCompany ? '/applications' : '/my-applications')}
          style={{ marginTop: 12, padding: '10px 20px', background: '#4f46e5', border: 'none', borderRadius: 10, color: 'white', cursor: 'pointer', fontWeight: 600 }}
        >
          Go Back
        </button>
      </div>
    </div>
  );

  const sc = statusColor(application.status);

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Navbar />

      <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', padding: '48px 64px', color: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <button
            onClick={() => navigate(isCompany ? '/applications' : '/my-applications')}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', marginBottom: 20, fontSize: 14, fontWeight: 500 }}
          >
            ← {isCompany ? 'All Applications' : 'My Applications'}
          </button>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>
            {isCompany ? (application.studentName || 'Applicant') : application.listingTitle}
          </h1>
          <p style={{ opacity: 0.8, marginTop: 8, fontSize: 15 }}>
            {isCompany ? application.listingTitle : application.companyName}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '48px auto', padding: '0 64px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Status + info card */}
        <div style={{ background: 'white', borderRadius: 24, padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>Application Status</h2>
            <span style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, padding: '6px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700 }}>
              {application.status || 'Pending'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: '#f8faff', borderRadius: 12, padding: '16px 20px' }}>
              <p style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', margin: '0 0 4px' }}>Applied</p>
              <p style={{ fontSize: 15, color: '#111827', margin: 0, fontWeight: 600 }}>
                {new Date(application.appliedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            {isCompany ? (
              <div style={{ background: '#f8faff', borderRadius: 12, padding: '16px 20px' }}>
                <p style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', margin: '0 0 4px' }}>Applicant Email</p>
                <p style={{ fontSize: 15, color: '#111827', margin: 0, fontWeight: 600 }}>{application.studentEmail || '—'}</p>
              </div>
            ) : (
              application.companyName && (
                <div style={{ background: '#f8faff', borderRadius: 12, padding: '16px 20px' }}>
                  <p style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', margin: '0 0 4px' }}>Company</p>
                  <p style={{ fontSize: 15, color: '#111827', margin: 0, fontWeight: 600 }}>{application.companyName}</p>
                </div>
              )
            )}
          </div>

          {/* CV */}
          {application.cvUrl && (
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {isCompany ? "Applicant's CV" : 'Submitted CV'}
              </p>
              <a
                href={`http://localhost:22792${application.cvUrl}`}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#f5f3ff', border: '1.5px solid #c4b5fd', borderRadius: 10, color: '#4f46e5', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
              >
                📎 Download CV
              </a>
            </div>
          )}

          {/* Cover letter (view mode) */}
          {!editing && application.coverLetter && (
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cover Letter</p>
              <div style={{ background: '#f8faff', borderRadius: 12, padding: '20px 24px', color: '#374151', lineHeight: 1.8, fontSize: 14, whiteSpace: 'pre-wrap' }}>
                {application.coverLetter}
              </div>
            </div>
          )}

          {/* Company: approve / reject buttons */}
          {isCompany && (
            <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid #f1f5f9' }}>
              {statusError && (
                <div style={{ background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 10, padding: '10px 16px', color: '#c53030', fontSize: 14, marginBottom: 16 }}>
                  {statusError}
                </div>
              )}
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  disabled={updatingStatus || application.status === 'Approved'}
                  onClick={() => handleStatusUpdate(1)}
                  style={{ padding: '11px 28px', background: application.status === 'Approved' ? '#f0fdf4' : '#4f46e5', border: application.status === 'Approved' ? '1.5px solid #bbf7d0' : 'none', borderRadius: 10, color: application.status === 'Approved' ? '#166534' : 'white', fontSize: 14, fontWeight: 700, cursor: application.status === 'Approved' ? 'default' : 'pointer', opacity: updatingStatus ? 0.6 : 1 }}
                >
                  {application.status === 'Approved' ? '✓ Approved' : 'Approve'}
                </button>
                <button
                  disabled={updatingStatus || application.status === 'Rejected'}
                  onClick={() => handleStatusUpdate(2)}
                  style={{ padding: '11px 28px', background: application.status === 'Rejected' ? '#fff5f5' : 'white', border: application.status === 'Rejected' ? '1.5px solid #feb2b2' : '1.5px solid #e5e7eb', borderRadius: 10, color: application.status === 'Rejected' ? '#c53030' : '#374151', fontSize: 14, fontWeight: 700, cursor: application.status === 'Rejected' ? 'default' : 'pointer', opacity: updatingStatus ? 0.6 : 1 }}
                >
                  {application.status === 'Rejected' ? '✕ Rejected' : 'Reject'}
                </button>
              </div>
            </div>
          )}

          {/* Student: edit toggle */}
          {!isCompany && !editing && (
            <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid #f1f5f9' }}>
              <button
                onClick={openEdit}
                style={{ padding: '11px 28px', background: '#f5f3ff', border: '1.5px solid #c4b5fd', borderRadius: 10, color: '#4f46e5', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
              >
                Edit Application
              </button>
            </div>
          )}

          {/* Student: edit form */}
          {!isCompany && editing && (
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginTop: 0, marginBottom: 20 }}>Edit Application</h3>

              {editError && (
                <div style={{ background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 10, padding: '10px 16px', color: '#c53030', fontSize: 14, marginBottom: 16 }}>
                  {editError}
                </div>
              )}

              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
                Replace CV <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional — PDF, DOC or DOCX, max 10 MB)</span>
              </label>
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px',
                  border: `1.5px dashed ${editCvError ? '#dc2626' : editCvFile ? '#4f46e5' : '#e5e7eb'}`,
                  borderRadius: 10, cursor: 'pointer',
                  background: editCvFile ? '#f5f3ff' : '#fafafa',
                }}>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleEditFileChange} style={{ display: 'none' }} />
                  <span style={{ fontSize: 20 }}>📎</span>
                  <span style={{ fontSize: 14, color: editCvFile ? '#4f46e5' : '#9ca3af', fontWeight: editCvFile ? 600 : 400 }}>
                    {editCvFile ? editCvFile.name : 'Click to upload a new CV'}
                  </span>
                  {editCvFile && (
                    <button onClick={e => { e.preventDefault(); setEditCvFile(null); }} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: 16 }}>✕</button>
                  )}
                </label>
                {editCvError && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 6, marginBottom: 0 }}>{editCvError}</p>}
              </div>

              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Cover Letter</label>
              <textarea
                value={editCoverLetter}
                onChange={e => setEditCoverLetter(e.target.value)}
                placeholder="Tell the company why you're a great fit..."
                style={{ ...inputStyle, height: 160, resize: 'vertical', marginBottom: 20 }}
              />

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  style={{ padding: '11px 28px', background: '#4f46e5', border: 'none', borderRadius: 10, color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  style={{ padding: '11px 28px', background: '#f8faff', border: '1.5px solid #e5e7eb', borderRadius: 10, color: '#374151', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Internship details card */}
        {listing && (
          <div style={{ background: 'white', borderRadius: 24, padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginTop: 0, marginBottom: 16 }}>Internship Details</h2>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
              {listing.location && <span style={{ background: '#f1f5f9', color: '#374151', padding: '5px 14px', borderRadius: 100, fontSize: 13 }}>📍 {listing.location}</span>}
              {listing.type && <span style={{ background: '#f1f5f9', color: '#374151', padding: '5px 14px', borderRadius: 100, fontSize: 13 }}>{listing.type}</span>}
              {listing.duration && <span style={{ background: '#f1f5f9', color: '#374151', padding: '5px 14px', borderRadius: 100, fontSize: 13 }}>⏱ {listing.duration}</span>}
            </div>
            {listing.description && (
              <p style={{ color: '#374151', lineHeight: 1.8, margin: 0, fontSize: 14, whiteSpace: 'pre-wrap' }}>{listing.description}</p>
            )}
            {listing.requirements && (
              <>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginTop: 24, marginBottom: 10 }}>Requirements</h3>
                <p style={{ color: '#374151', lineHeight: 1.8, margin: 0, fontSize: 14, whiteSpace: 'pre-wrap' }}>{listing.requirements}</p>
              </>
            )}
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default ApplicationDetail;
