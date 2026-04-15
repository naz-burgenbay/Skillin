import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../api/authService';
import {
  Container, Box, TextField, Button, Typography,
  Alert, Paper, ToggleButton, ToggleButtonGroup
} from '@mui/material';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '', password: '', role: 'Student'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRole = (e, newRole) => {
    if (newRole) setForm({ ...form, role: newRole });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register({
        email: form.email,
        password: form.password,
        role: form.role === 'Student' ? 0 : 1
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight="bold" mb={1}>
            Skillin
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Create your account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="body2" mb={1}>I am a:</Typography>
            <ToggleButtonGroup
              value={form.role} exclusive onChange={handleRole}
              fullWidth sx={{ mb: 2 }}
            >
              <ToggleButton value="Student">Student</ToggleButton>
              <ToggleButton value="Company">Company</ToggleButton>
            </ToggleButtonGroup>

            <TextField
              fullWidth label="Email" name="email" type="email"
              value={form.email} onChange={handleChange}
              margin="normal" required
            />
            <TextField
              fullWidth label="Password" name="password" type="password"
              value={form.password} onChange={handleChange}
              margin="normal" required
            />
            <Button
              fullWidth type="submit" variant="contained"
              size="large" sx={{ mt: 3, mb: 2, borderRadius: 2 }}
            >
              Register
            </Button>
          </Box>

          <Typography variant="body2" textAlign="center">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#1976d2' }}>
              Sign In
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;