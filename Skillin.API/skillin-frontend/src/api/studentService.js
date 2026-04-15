import axiosInstance from './axiosInstance';

export const getMyProfile = () =>
  axiosInstance.get('/students/me');

export const updateMyProfile = (data) =>
  axiosInstance.put('/students/me', data);