import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://smart-apartment-backend-production.up.railway.app";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true
});
/* ======================
   Maintenance Requests
   ====================== */

// technician completes request with cost
export const completeRequest = (request_id, cost) =>
  api.put(`/requests/complete/${request_id}`, { cost });

/* ======================
   Payments
   ====================== */

// get pending maintenance request bills
export const getPendingBills = (resident_id) =>
  api.get(`/payments/pending/${resident_id}`);

// pay maintenance request bill (validated by request_id)
export const payMaintenanceBill = (data) =>
  api.post("/payments/pay", data);

export const getPaymentHistory = (resident_id) =>
  api.get(`/payments/history/${resident_id}`);


export const getResidentStats = (resident_id) =>
  api.get(`/requests/stats/resident/${resident_id}`);

// Notifications
export const getNotifications = (userType, userId) => api.get(`/notifications/${userType}/${userId}`);
export const markNotificationAsRead = (id) => api.put(`/notifications/read/${id}`);

// Tech Stats
export const getTechStats = (technicianId) => api.get(`/requests/tech-stats/${technicianId}`);


/* ======================
   Auth
   ====================== */

export const registerResident = (data) => api.post("/users/register", data);

export const loginResident = (data) => api.post("/users/login", data);
export const loginTechnician = (data) => api.post('/users/login/technician', data);
export const getTechnicians = () => api.get('/users/technicians');

export const getAssets = () => api.get("/assets");

// Technician Requests
export const getTechnicianRequests = (technicianId) =>
  api.get(`/requests/technician/${technicianId}`);

export default api;