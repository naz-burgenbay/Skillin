import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllListings } from '../../api/listingService';
import { useAuth } from '../../context/AuthContext';
import {
  Container, Box, Typography, Card, CardContent,
  Button, Grid, Chip, TextField, CircularProgress
} from '@mui/material';

const Listings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllListings()
      .then(res => {
        setListings(res.data);
        setFiltered(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(listings.filter(l =>
      l.title?.toLowerCase().includes(q) ||
      l.position?.toLowerCase().includes(q) ||
      l.location?.toLowerCase().includes(q)
    ));
  }, [search, listings]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>

        {/* Navbar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>
            Skillin
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button onClick={() => navigate('/home')}>Home</Button>
            <Button onClick={() => navigate('/profile/student')}>My Profile</Button>
            <Button variant="outlined" color="error" onClick={() => { logout(); navigate('/login'); }}>
              Logout
            </Button>
          </Box>
        </Box>

        {/* Title */}
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Internship Listings
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Find the perfect internship for you
        </Typography>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search by title, position or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mb: 4 }}
        />

        {/* Listings */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress />
          </Box>
        ) : filtered.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" mt={8}>
            No internships found.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filtered.map(listing => (
              <Grid item xs={12} md={6} lg={4} key={listing.id}>
                <Card sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                      {listing.title}
                    </Typography>
                    <Chip label={listing.position} size="small" sx={{ mb: 2 }} />
                    <Typography color="text.secondary" variant="body2" mb={1}>
                      📍 {listing.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}
                      sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {listing.description}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth variant="contained"
                      onClick={() => navigate(`/listings/${listing.id}`)}
                    >
                      View Details
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Listings;