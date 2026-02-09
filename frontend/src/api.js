import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
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

/* ======================
   Auth
   ====================== */

export const registerResident = (data) => api.post("/users/register", data);

export const loginResident = (data) => api.post("/users/login", data);
export const loginTechnician = (data) => api.post('/users/login/technician', data);
export const getTechnicians = () => api.get('/users/technicians');

export const getAssets = () => api.get("/assets");

export default api;
