import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const loginUser = async (credentials: { email: string; password: any }) => {
  const response = await api.post('/login', null, { 
    params: {
      email: credentials.email,
      password: credentials.password
    }
  });

  if (response.data.status === "success") {
    localStorage.setItem('userEmail', credentials.email);
    localStorage.setItem('username', response.data.user);
  }

  return response.data;
};

export const registerUser = async (userData: { username: string; email: string; password: any }) => {
  const response = await api.post('/register', userData);
  return response.data;
};

export const healthService = {
  getAnalytics: async (email: string) => {
    const response = await api.get(`/analytics/${email}`);
    return response.data;
  },

  getHistory: async (email: string) => {
    const response = await api.get(`/history/${email}`);
    return response.data;
  },

  predictObesity: async (email: string, data: any) => {
    const response = await api.post(`/predict`, data, {
      params: { user_email: email }
    });
    return response.data;
  }
};

export default api;