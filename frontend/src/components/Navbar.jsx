import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CreditCard, Home, Info, LogOut, Shield, Wrench } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const { user, role, logout } = useAuth();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-600 hover:text-white';
    };

    if (location.pathname === '/') return null; // Don't show navbar on login page

    return (
        <nav className="bg-blue-600 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link to={role === 'admin' ? '/admin-dashboard' : role === 'technician' ? '/technician-dashboard' : '/dashboard'} className="flex items-center gap-2 text-white font-bold text-xl">
                            <Home size={24} />
                            <span>SmartStay</span>
                        </Link>

                        <div className="hidden md:block">
                            <div className="flex items-baseline space-x-4">
                                {role === 'resident' && (
                                    <>
                                        <Link to="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/dashboard')}`}>
                                            <LayoutDashboard size={18} /> Dashboard
                                        </Link>
                                        <Link to="/payments" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/payments')}`}>
                                            <CreditCard size={18} /> Payments
                                        </Link>
                                    </>
                                )}

                                {role === 'admin' && (
                                    <Link to="/admin-dashboard" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/admin-dashboard')}`}>
                                        <Shield size={18} /> Admin Panel
                                    </Link>
                                )}

                                {role === 'technician' && (
                                    <Link to="/technician-dashboard" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/technician-dashboard')}`}>
                                        <Wrench size={18} /> My Tasks
                                    </Link>
                                )}

                                <Link to="/about" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/about')}`}>
                                    <Info size={18} /> About
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {user && <span className="text-blue-100 text-sm">Hello, {user.name || 'Admin'}</span>}
                        <Link
                            to="/"
                            onClick={logout}
                            className="text-white hover:text-red-200 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <LogOut size={18} />
                            Logout
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
