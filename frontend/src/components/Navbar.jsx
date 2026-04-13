import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CreditCard, Home, Info, LogOut, Shield, Wrench, X, Menu, Sun, Moon } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ darkMode, setDarkMode }) => {
    const location = useLocation();
    const { user, role, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    // Hide navbar on landing page (if desired, or keep for consistency)
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
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav shadow-lg py-2' : 'bg-transparent py-4'
            }`}>
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link
                            to={role === 'admin' ? '/admin-dashboard' : role === 'technician' ? '/technician-dashboard' : '/dashboard'}
                            className="flex items-center gap-2 text-2xl font-black text-primary-600 dark:text-primary-400 group"
                        >
                            <motion.div
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                            >
                                <Home size={24} />
                            </motion.div>
                            <span className="tracking-tight">SmartStay</span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link, idx) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="relative px-4 py-2"
                                >
                                    <span className={`relative z-10 flex items-center gap-2 text-sm font-semibold transition-colors duration-300 ${isActive(link.to)
                                            ? 'text-primary-600 dark:text-primary-400'
                                            : 'text-surface-600 hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400'
                                        }`}>
                                        <link.icon size={16} />
                                        <span>{link.label}</span>
                                    </span>
                                    {isActive(link.to) && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 rounded-xl"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* User & Logout & Dark Mode */}
                    <div className="flex items-center gap-3">
                        <NotificationDropdown />
                        
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2.5 transition-colors rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-400 hover:border-primary-300 dark:hover:border-primary-700"
                        >
                            {darkMode ? (
                                <Sun size={18} className="text-amber-400" />
                            ) : (
                                <Moon size={18} className="text-secondary-600" />
                            )}
                        </motion.button>

                        {user && (
                            <div className="hidden lg:flex flex-col items-end mr-2">
                                <span className="text-xs font-bold text-surface-400 uppercase tracking-wider">Welcome</span>
                                <span className="text-sm font-semibold text-surface-900 dark:text-white">
                                    {user.name.split(' ')[0]}
                                </span>
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all"
                        >
                            <LogOut size={16} />
                            <span className="hidden sm:inline">Logout</span>
                        </motion.button>

                        {/* Mobile toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 rounded-xl border border-surface-200 dark:border-surface-800 text-surface-600 dark:text-surface-400"
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass-nav border-t border-surface-100 dark:border-surface-800"
                    >
                        <div className="px-4 py-6 space-y-2">
                            {navLinks.map((link, idx) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-base font-bold transition-all ${isActive(link.to)
                                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                                            : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                                        }`}
                                >
                                    <link.icon size={20} />
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
