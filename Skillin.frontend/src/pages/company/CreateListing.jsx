import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../../api/listingService';
import { useAuth } from '../../context/AuthContext';
import {
  Container, Box, Typography, TextField,
  Button, Paper, Alert
} from '@mui/material';

const CreateListing = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', location: '', position: ''
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await createListing(form);
      navigate('/home');
    } catch {
      setError('Failed to create listing.');
    }
  };

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
            <Button onClick={() => navigate('/applications')}>Applications</Button>
            <Button variant="outlined" color="error" onClick={() => { logout(); navigate('/login'); }}>
              Logout
            </Button>
          </Box>
        </Box>

        <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Create Internship Listing
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="Title" name="title"
              value={form.title} onChange={handleChange}
              margin="normal" required />
            <TextField fullWidth label="Position" name="position"
              value={form.position} onChange={handleChange}
              margin="normal" required />
            <TextField fullWidth label="Location" name="location"
              value={form.location} onChange={handleChange}
              margin="normal" required />
            <TextField fullWidth label="Description" name="description"
              value={form.description} onChange={handleChange}
              margin="normal" required multiline rows={5} />
            <Button type="submit" variant="contained" size="large" sx={{ mt: 3 }}>
              Publish Listing
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateListing;