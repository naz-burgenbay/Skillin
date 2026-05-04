import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Listings from './pages/student/Listings';
import ListingDetail from './pages/student/ListingDetail';
import MyApplications from './pages/student/MyApplications';
import ApplicationDetail from './pages/student/ApplicationDetail';
import StudentProfile from './pages/student/StudentProfile';
import CompanyProfile from './pages/company/CompanyProfile';
import CreateListing from './pages/company/CreateListing';
import MyListings from './pages/company/MyListings';
import Applications from './pages/company/Applications';
import EditListing from './pages/company/EditListing';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/home" element={
            <PrivateRoute><Home /></PrivateRoute>
          } />
          <Route path="/listings" element={
            <PrivateRoute><Listings /></PrivateRoute>
          } />
          <Route path="/listings/create" element={
            <PrivateRoute><CreateListing /></PrivateRoute>
          } />
          <Route path="/listings/:id" element={
            <PrivateRoute><ListingDetail /></PrivateRoute>
          } />
          <Route path="/listings/:id/edit" element={
            <PrivateRoute><EditListing /></PrivateRoute>
          } />
          <Route path="/my-listings" element={
            <PrivateRoute><MyListings /></PrivateRoute>
          } />
          <Route path="/my-applications" element={
            <PrivateRoute><MyApplications /></PrivateRoute>
          } />
          <Route path="/profile/student" element={
            <PrivateRoute><StudentProfile /></PrivateRoute>
          } />
          <Route path="/profile/company" element={
            <PrivateRoute><CompanyProfile /></PrivateRoute>
          } />
          <Route path="/applications" element={
            <PrivateRoute><Applications /></PrivateRoute>
          } />
          <Route path="/applications/:id" element={
            <PrivateRoute><ApplicationDetail /></PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;