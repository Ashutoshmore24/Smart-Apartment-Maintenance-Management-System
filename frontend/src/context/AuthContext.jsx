/* Everything Ready */
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://smart-apartment-maintenance-management-w8ds.onrender.com";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // 'admin', 'resident', 'technician'
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            // Check cookie-based Google auth first
            const res = await axios.get(`${BACKEND_URL}/auth/me`, {
                withCredentials: true
              });
            if (res.data.user) {
                setUser(res.data.user);
                setRole(res.data.role);
                // Also store it so non-react things (if any) can read it, or just rely on state
                localStorage.setItem('smart_apartment_user', JSON.stringify(res.data.user));
                localStorage.setItem('smart_apartment_role', res.data.role);
            }
        } catch (err) {
            // Not logged in via cookie, fallback to localStorage
            const storedUser = localStorage.getItem('smart_apartment_user');
            const storedRole = localStorage.getItem('smart_apartment_role');
            if (storedUser && storedRole) {
                setUser(JSON.parse(storedUser));
                setRole(storedRole);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = (userData, userRole) => {
        setUser(userData);
        setRole(userRole);
        localStorage.setItem('smart_apartment_user', JSON.stringify(userData));
        localStorage.setItem('smart_apartment_role', userRole);
    };

    const logout = async () => {
        try {
            await axios.post(`${BACKEND_URL}/auth/logout`, {}, {
                withCredentials: true
              });
        } catch (e) { console.error(e) }

        setUser(null);
        setRole(null);
        localStorage.removeItem('smart_apartment_user');
        localStorage.removeItem('smart_apartment_role');
    };

    return (
        <AuthContext.Provider value={{ user, role, login, logout, checkAuth }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};