import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../api/authService';
import {
  Container, Box, TextField, Button,
  Typography, Alert, Paper
} from '@mui/material';

const Login = () => {
  const { login: saveToken } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await login(form);
      saveToken(res.data.token, res.data.role);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight="bold" mb={1}>
            Skillin
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Sign in to your account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
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
              Sign In
            </Button>
          </Box>

          <Typography variant="body2" textAlign="center">
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#1976d2' }}>
              Register
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;