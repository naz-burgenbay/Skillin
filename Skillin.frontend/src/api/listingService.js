import axiosInstance from './axiosInstance';

export const getAllListings = () =>
  axiosInstance.get('/listings');

export const getListingById = (id) =>
  axiosInstance.get(`/listings/${id}`);

export const createListing = (data) =>
  axiosInstance.post('/listings', data);

export const getMyListings = () =>
  axiosInstance.get('/listings/mine');