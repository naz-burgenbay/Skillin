import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Navbar */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', px: 6, py: 3
      }}>
        <Typography variant="h5" fontWeight="bold" color="white">
          Skillin
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/login')}
            sx={{ color: 'white', borderColor: 'white', borderRadius: 3 }}
          >
            Sign In
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/register')}
            sx={{ borderRadius: 3, bgcolor: '#6c63ff' }}
          >
            Get Started
          </Button>
        </Box>
      </Box>

      {/* Hero */}
      <Container maxWidth="md">
        <Box sx={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
          mt: 12
        }}>
          <Typography variant="h2" fontWeight="bold" color="white" mb={3}>
            Find Your Dream
            <Box component="span" sx={{ color: '#6c63ff' }}> Internship</Box>
          </Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.7)" mb={6} maxWidth={600}>
            Connect students with top companies. Build your career, 
            gain experience, and shape your future with Skillin.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button
              variant="contained" size="large"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: '#6c63ff', borderRadius: 3,
                px: 5, py: 1.5, fontSize: 16
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined" size="large"
              onClick={() => navigate('/login')}
              sx={{
                color: 'white', borderColor: 'white',
                borderRadius: 3, px: 5, py: 1.5, fontSize: 16
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Features */}
      <Container maxWidth="lg" sx={{ mt: 12, mb: 8 }}>
        <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { title: 'For Students', desc: 'Create your profile, browse internships and apply with one click.', icon: '🎓' },
            { title: 'For Companies', desc: 'Post internship listings and find the best student talent.', icon: '🏢' },
            { title: 'Easy & Fast', desc: 'Simple platform designed for early career opportunities.', icon: '⚡' },
          ].map((f) => (
            <Box key={f.title} sx={{
              bgcolor: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4, p: 4, width: 280,
              textAlign: 'center'
            }}>
              <Typography fontSize={40} mb={2}>{f.icon}</Typography>
              <Typography variant="h6" fontWeight="bold" color="white" mb={1}>
                {f.title}
              </Typography>
              <Typography color="rgba(255,255,255,0.6)" variant="body2">
                {f.desc}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Landing;
