

// import axios from 'axios';

// // const API_BASE_URL = 'http://127.0.0.1:8000/api';


// const API_BASE_URL =
//   import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Auto-attach JWT token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('access_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;

// // ================= AUTH =================
// export const registerUser = (data) => api.post('/register/', data);
// export const loginUser = (data) => api.post('/login/', data);   // ← Must pass object

// // ================= PRODUCES =================
// export const getProduces = () => api.get('/produces/');           // All produces
// export const getMyProduces = () => api.get('/produces/my/');
// export const createProduce = (data) =>
//   api.post('/produces/', data);

// // export const createProduce = (data) => api.post('/produces/', data,{headers:{'content-type':'multipart/form-data'}});
// export const updateProduce = (id, data) => api.put(`/produces/${id}/`, data);
// export const deleteProduce = (id) => api.delete(`/produces/${id}/`);



// //price prediction//
// export const predictPrice = (data) =>
//   api.post('/predict-price/', data);




import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

// ================= AUTH =================
export const registerUser = (data) => api.post('/register/', data);
export const loginUser = (data) => api.post('/login/', data);

// ================= PRODUCES =================
export const getProduces = () => api.get('/produces/');
export const getMyProduces = () => api.get('/produces/my/');
export const createProduce = (data) => api.post('/produces/', data);
export const updateProduce = (id, data) =>
  api.put(`/produces/${id}/`, data);
export const deleteProduce = (id) =>
  api.delete(`/produces/${id}/`);

// ================= PRICE PREDICTION =================
export const predictPrice = (data) =>
  api.post('/predict-price/', data);
