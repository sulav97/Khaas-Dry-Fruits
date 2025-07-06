import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Centralized error handler
const handleError = (error) => {
  if (error.response && error.response.data && error.response.data.msg) {
    throw new Error(error.response.data.msg);
  }
  throw error;
};

// Dryfruits
export const getAllDryfruits = async () => {
  try {
    const res = await api.get("/dryfruits");
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const getDryfruitById = async (id) => {
  try {
    const res = await api.get(`/dryfruits/${id}`);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const createDryfruit = async (data) => {
  try {
    const res = await api.post("/dryfruits", data);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const updateDryfruit = async (id, data) => {
  try {
    const res = await api.put(`/dryfruits/${id}`, data);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const deleteDryfruit = async (id) => {
  try {
    const res = await api.delete(`/dryfruits/${id}`);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const getDryfruitByName = async (name) => {
  try {
    const res = await api.get(`/dryfruits/name/${encodeURIComponent(name)}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

// Bookings
export const createBooking = async (data) => {
  try {
    const res = await api.post("/bookings", data);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const getUserBookings = async () => {
  try {
    const res = await api.get("/bookings/my");
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const getAllBookings = async () => {
  try {
    const res = await api.get("/bookings");
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const updateBookingStatus = async (id, status) => {
  try {
    const res = await api.patch(`/bookings/${id}/status`, { status });
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// Users
export const getProfile = async () => {
  try {
    const res = await api.get("/users/profile");
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const updateProfile = async (data) => {
  try {
    const res = await api.put("/users/profile", data);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const getAllUsers = async () => {
  try {
    const res = await api.get("/users");
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const blockUser = async (id) => {
  try {
    const res = await api.patch(`/users/${id}/block`);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const unblockUser = async (id) => {
  try {
    const res = await api.patch(`/users/${id}/unblock`);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// Auth
export const login = async (data) => {
  try {
    const res = await api.post("/auth/login", data);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const register = async (data) => {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// ✅ Add this at the very end for default import support
export default api;
