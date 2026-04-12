/* Everything Ready */
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CreditCard, Home, Info, LogOut, Shield, Wrench, X, Menu, Sun, Moon } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

const Navbar = ({ darkMode, setDarkMode }) => {
    const location = useLocation();
    const { user, role, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    // Hide navbar on landing page
    if (location.pathname === '/') return null;

    const navLinks = [
        ...(role === 'resident' ? [
            { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/payments', icon: CreditCard, label: 'Payments' },
        ] : []),
        ...(role === 'admin' ? [
            { to: '/admin-dashboard', icon: Shield, label: 'Admin Panel' },
        ] : []),
        ...(role === 'technician' ? [
            { to: '/technician-dashboard', icon: Wrench, label: 'My Tasks' },
        ] : []),
        { to: '/about', icon: Info, label: 'About' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-blue-600 shadow-md dark:bg-gray-900 dark:border-b dark:border-gray-700">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link
                            to={role === 'admin' ? '/admin-dashboard' : role === 'technician' ? '/technician-dashboard' : '/dashboard'}
                            className="flex items-center gap-2 text-xl font-bold text-white transition-colors duration-300 dark:text-blue-400"
                        >
                            <Home size={24} />
                            <span>SmartStay</span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${isActive(link.to)
                                            ? 'bg-blue-700 text-white dark:bg-gray-700'
                                            : 'text-blue-100 hover:text-white hover:bg-blue-500 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <link.icon size={16} />
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* User & Logout & Dark Mode */}
                    <div className="flex items-center gap-4">
                        <NotificationDropdown />
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
                            className="text-white hover:text-red-200 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <LogOut size={16} />
                            <span className="hidden sm:inline">Logout</span>
                        </Link>

                        {/* Mobile toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 rounded-lg text-blue-100 hover:text-white hover:bg-blue-500 transition-colors"
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {mobileOpen && (
                <div className="md:hidden border-t border-blue-500 dark:border-gray-700">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(link.to)
                                        ? 'bg-blue-700 text-white dark:bg-gray-700'
                                        : 'text-blue-100 hover:text-white hover:bg-blue-500 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <link.icon size={18} />
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
