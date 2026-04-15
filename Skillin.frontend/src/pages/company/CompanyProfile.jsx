import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyCompany, updateMyCompany } from '../../api/companyService';
import { useAuth } from '../../context/AuthContext';
import {
  Container, Box, Typography, TextField,
  Button, Paper, Alert, CircularProgress
} from '@mui/material';

const CompanyProfile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', ceo: '', hr: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getMyCompany()
      .then(res => setForm(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await updateMyCompany(form);
      setSuccess('Profile updated successfully!');
    } catch {
      setError('Failed to update profile.');
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>

        {/* Navbar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>
            Skillin
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button onClick={() => navigate('/home')}>Home</Button>
            <Button onClick={() => navigate('/listings/create')}>Post Internship</Button>
            <Button onClick={() => navigate('/applications')}>Applications</Button>
            <Button variant="outlined" color="error" onClick={() => { logout(); navigate('/login'); }}>
              Logout
            </Button>
          </Box>
        </Box>

        <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" mb={3}>Company Profile</Typography>

          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="Company Name" name="name"
              value={form.name || ''} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Email" name="email" type="email"
              value={form.email || ''} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="CEO" name="ceo"
              value={form.ceo || ''} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="HR Contact" name="hr"
              value={form.hr || ''} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Bio" name="bio"
              value={form.bio || ''} onChange={handleChange}
              margin="normal" multiline rows={4} />
            <Button type="submit" variant="contained" size="large" sx={{ mt: 3 }}>
              Save Changes
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CompanyProfile;
