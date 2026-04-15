import axiosInstance from './axiosInstance';

export const getMyCompany = () =>
  axiosInstance.get('/companies/me');

export const updateMyCompany = (data) =>
  axiosInstance.put('/companies/me', data);