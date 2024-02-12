import axios from 'axios';
export const axiosInstance = axios.create({
  baseURL: "https://bargainbackend.onrender.com",
  headers: {
    authorization: `Bearer ${localStorage.getItem('token')}`
  }
});