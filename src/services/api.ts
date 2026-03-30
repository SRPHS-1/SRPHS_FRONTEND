import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Auth local 
export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await api.post('/login', null, {
    params: { email: credentials.email, password: credentials.password },
  });

  if (response.data.status === 'success') {
    localStorage.setItem('userEmail',  credentials.email);
    localStorage.setItem('username',   response.data.user);
    localStorage.setItem('userAvatar', response.data.avatar ?? '');
  }

  return response.data;
};

export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  const response = await api.post('/register', userData);
  return response.data;
};

// Auth Google 
export const googleLogin = async (credential: string) => {
  const response = await api.post('/auth/google/login', { credential });

  if (response.data.status === 'success') {
    localStorage.setItem('username',   response.data.user);
    localStorage.setItem('userAvatar', response.data.avatar ?? '');
  }

  return response.data;
};

export const googleRegister = async (credential: string) => {
  const response = await api.post('/auth/google/register', { credential });

  if (response.data.status === 'success') {
    localStorage.setItem('username',   response.data.user);
    localStorage.setItem('userAvatar', response.data.avatar ?? '');
  }

  return response.data;
};

// Health service para obtener analíticas, historial y predicciones de obesidad
export const healthService = {
  getAnalytics: async (email: string) => {
    const response = await api.get(`/analytics/${email}`);
    return response.data;
  },

  getHistory: async (email: string) => {
    const response = await api.get(`/history/${email}`);
    return response.data;
  },

  predictObesity: async (email: string, data: unknown) => {
    const response = await api.post('/predict', data, {
      params: { user_email: email },
    });
    return response.data;
  },
};

export default api;