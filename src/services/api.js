import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ---------------------- BUILDINGS ---------------------- */
export const getBuildings = () => api.get('/buildings');
export const getBuilding = (id) => api.get(`/buildings/${id}`);

/* ---------------------- FLOORS ---------------------- */
  export const getFloors = (params) => {
  if (typeof params === 'string') {
    return api.get('/floors', { params: { building_id: params } });
  }
  return api.get('/floors', { params: params || {} });
};

export const getFloor = (id) => api.get(`/floors/${id}`);

/* ---------------------- ROOMS ---------------------- */
// GET
export const getRooms = (params) => api.get('/rooms', { params });
export const getRoom = (id) => api.get(`/rooms/${id}`);

// CREATE
export const createRoom = (data) => api.post('/rooms', data);

// UPDATE
export const updateRoom = (id, data) => api.put(`/rooms/${id}`, data);

// DELETE
export const deleteRoom = (id) => api.delete(`/rooms/${id}`);

/* ---------------------- FACULTY ---------------------- */
export const getFaculty = (params) => api.get('/faculty', { params });
export const getFacultyById = (id) => api.get(`/faculty/${id}`);

/* ---------------------- DEPARTMENTS ---------------------- */
export const getDepartments = () => api.get('/departments');
export const getDepartment = (id) => api.get(`/departments/${id}`);

/* ---------------------- FACILITIES ---------------------- */
export const getFacilities = (params) => api.get('/facilities', { params });
export const getFacility = (id) => api.get(`/facilities/${id}`);

/* ---------------------- SEARCH ---------------------- */
export const search = (params) => api.get('/search', { params });

/* ---------------------- ADMIN ---------------------- */
export const getAdminDashboard = () => api.get('/admin/dashboard');
export const bulkCreate = (operation, data) =>
  api.post('/admin/bulk', { operation, data });

export default api;
