import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import {
  Container, Box, Typography, TextField,
  Button, Paper, Alert, CircularProgress
} from '@mui/material';

const StudentProfile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', bio: '', skills: '', universityName: ''
  });
  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axiosInstance.get('/students/me')
      .then(res => {
        setForm(res.data);
        setProfileId(res.data.id);
      })
      .catch(() => setProfileId(null))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      if (profileId) {
        await axiosInstance.put(`/students/${profileId}`, form);
      } else {
        await axiosInstance.post('/students', form);
      }
      setSuccess('Profile saved successfully!');
    } catch {
      setError('Failed to save profile.');
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>
            Skillin
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button onClick={() => navigate('/home')}>Home</Button>
            <Button onClick={() => navigate('/listings')}>Find Internships</Button>
            <Button variant="outlined" color="error" onClick={() => { logout(); navigate('/login'); }}>
              Logout
            </Button>
          </Box>
        </Box>

        <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" mb={3}>My Profile</Typography>

          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="Full Name" name="fullName"
              value={form.fullName || ''} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="University" name="universityName"
              value={form.universityName || ''} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Skills" name="skills"
              value={form.skills || ''} onChange={handleChange} margin="normal"
              placeholder="e.g. React, Python, SQL" />
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

export default StudentProfile;