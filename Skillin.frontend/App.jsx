import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Listings from './pages/student/Listings';
import StudentProfile from './pages/student/StudentProfile';
import CompanyProfile from './pages/company/CompanyProfile';
import CreateListing from './pages/company/CreateListing';
import Applications from './pages/company/Applications';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Landing */}
          <Route path="/" element={<Landing />} />

          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* All logged in */}
          <Route path="/home" element={
            <PrivateRoute><Home /></PrivateRoute>
          } />
          <Route path="/listings" element={
            <PrivateRoute><Listings /></PrivateRoute>
          } />

          {/* Student */}
          <Route path="/profile/student" element={
            <PrivateRoute><StudentProfile /></PrivateRoute>
          } />

          {/* Company */}
          <Route path="/profile/company" element={
            <PrivateRoute><CompanyProfile /></PrivateRoute>
          } />
          <Route path="/listings/create" element={
            <PrivateRoute><CreateListing /></PrivateRoute>
          } />
          <Route path="/applications" element={
            <PrivateRoute><Applications /></PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;