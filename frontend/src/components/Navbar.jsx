import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CreditCard, Home, Info, LogOut, Shield, Wrench, Moon, Sun } from 'lucide-react';



const Navbar = ({ darkMode, setDarkMode }) => {
    const location = useLocation();
    const { user, role, logout } = useAuth();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-600 hover:text-white';
    };

    if (location.pathname === '/') return null; // Don't show navbar on login page

    return (
       

        <nav className="sticky top-0 z-50 bg-blue-600 shadow-md dark:bg-gray-900 dark:border-b dark:border-gray-700">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link to={role === 'admin' ? '/admin-dashboard' : role === 'technician' ? '/technician-dashboard' : '/dashboard'} className="flex items-center gap-2 text-xl font-bold text-white transition-colors duration-300 dark:text-blue-400">
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
                         {/* 🌙 Dark Mode Toggle */}
    <button
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 transition bg-blue-500 rounded-full hover:bg-blue-400 dark:bg-gray-700 dark:hover:bg-gray-600"
    >
        {darkMode ? (
            <Sun size={18} className="text-yellow-300" />
        ) : (
            <Moon size={18} className="text-white" />
        )}
    </button>

    {user && (
        <span className="text-sm text-blue-100 dark:text-gray-300">
            Hello, {user.name || 'Admin'}
        </span>
    )}
                        
                        <Link
                            to="/"
                            onClick={logout}
                            className="flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-red-200 dark:text-gray-300 dark:hover:text-red-400"
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
