import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllApplications } from '../../api/applicationService';
import { useAuth } from '../../context/AuthContext';
import {
  Container, Box, Typography, Paper, Button,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, CircularProgress
} from '@mui/material';

const statusColor = (status) => {
  if (status === 'Approved') return 'success';
  if (status === 'Rejected') return 'error';
  return 'warning';
};

const Applications = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllApplications()
      .then(res => setApplications(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
            <Button onClick={() => navigate('/listings/create')}>Post Internship</Button>
            <Button variant="outlined" color="error" onClick={() => { logout(); navigate('/login'); }}>
              Logout
            </Button>
          </Box>
        </Box>

        <Typography variant="h4" fontWeight="bold" mb={4}>
          Applications
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress />
          </Box>
        ) : applications.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" mt={8}>
            No applications yet.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Student</strong></TableCell>
                  <TableCell><strong>Listing</strong></TableCell>
                  <TableCell><strong>Position</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map(app => (
                  <TableRow key={app.id}>
                    <TableCell>{app.studentName || app.student?.name}</TableCell>
                    <TableCell>{app.listingTitle || app.listing?.title}</TableCell>
                    <TableCell>{app.position || app.listing?.position}</TableCell>
                    <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={app.status || 'Pending'}
                        color={statusColor(app.status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default Applications;