import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container, Box, Typography, Button, Grid, Card, CardContent
} from '@mui/material';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = user?.role || localStorage.getItem('role');

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>

        {/* Navbar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
          <Typography variant="h5" fontWeight="bold">Skillin</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button onClick={() => navigate('/listings')}>Find Internships</Button>
            {role === 'Student' && (
              <Button onClick={() => navigate('/profile/student')}>My Profile</Button>
            )}
            {role === 'Company' && (
              <Button onClick={() => navigate('/profile/company')}>Company Profile</Button>
            )}
            <Button variant="outlined" color="error" onClick={handleLogout}>Logout</Button>
          </Box>
        </Box>

        {/* Hero */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" fontWeight="bold" mb={2}>
            Welcome back, User!
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={4}>
            Discover new internships and projects today.
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate('/listings')}>
            Find Internships
          </Button>
        </Box>

        {/* Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, height: '100%', cursor: 'pointer' }}
              onClick={() => navigate('/listings')}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Find Internships
                </Typography>
                <Typography color="text.secondary">
                  Browse available internship listings from top companies.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, height: '100%', cursor: 'pointer' }}
              onClick={() => navigate(role === 'Company' ? '/profile/company' : '/profile/student')}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  My Profile
                </Typography>
                <Typography color="text.secondary">
                  Update your profile and upload your CV.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, height: '100%', cursor: 'pointer' }}
              onClick={() => navigate('/applications')}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Applications
                </Typography>
                <Typography color="text.secondary">
                  Track your internship applications.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </Box>
    </Container>
  );
};

export default Home;