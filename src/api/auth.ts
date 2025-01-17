import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL ,
});

export const registerUser = async (email: string, password: string) => {
  const response = await API.post('/register', { email, password });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await API.post('/login', { email, password });
  return response.data;
};
