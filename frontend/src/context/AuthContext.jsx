import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // 'admin', 'resident', 'technician'

    useEffect(() => {
        const storedUser = localStorage.getItem('smart_apartment_user');
        const storedRole = localStorage.getItem('smart_apartment_role');
        if (storedUser && storedRole) {
            setUser(JSON.parse(storedUser));
            setRole(storedRole);
        }
    }, []);

    const login = (userData, userRole) => {
        setUser(userData);
        setRole(userRole);
        localStorage.setItem('smart_apartment_user', JSON.stringify(userData));
        localStorage.setItem('smart_apartment_role', userRole);
    };

    const logout = () => {
        setUser(null);
        setRole(null);
        localStorage.removeItem('smart_apartment_user');
        localStorage.removeItem('smart_apartment_role');
    };

    return (
        <AuthContext.Provider value={{ user, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
