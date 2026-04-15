import axiosInstance from './axiosInstance';

export const applyToListing = (listingId) =>
  axiosInstance.post('/applications', { listingId });

export const getMyApplications = () =>
  axiosInstance.get('/applications/my');

export const getAllApplications = () =>
  axiosInstance.get('/applications'); // для компании