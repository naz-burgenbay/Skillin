import axiosInstance from './axiosInstance';

export const applyToListing = (listingId, coverLetter = '') =>
  axiosInstance.post('/applications', { listingId, coverLetter });

export const getMyApplications = () =>
  axiosInstance.get('/applications/my');

export const getAllApplications = () =>
  axiosInstance.get('/applications'); // для компании