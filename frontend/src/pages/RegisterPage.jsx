import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, Building, Wrench, ShieldCheck, ArrowRight, Home } from 'lucide-react';

const RegisterPage = () => {
    const [role, setRole] = useState('resident'); // 'resident' or 'technician'

    // Resident Data
    const [residentData, setResidentData] = useState({
        name: '', phone_number: '', email: '', flat_id: ''
    });

    // Technician Data
    const [techData, setTechData] = useState({
        name: '', phone_number: '', specialization: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleResidentChange = (e) => {
        setResidentData({ ...residentData, [e.target.name]: e.target.value });
    };

    const handleTechChange = (e) => {
        setTechData({ ...techData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (role === 'resident') {
                const res = await api.post('/users/register', residentData);
                alert(`Registration Successful! Your Resident ID is: ${res.data.resident_id}. Please remember this for login.`);
                navigate('/login');
            } else {
                const res = await api.post('/users/register/technician', techData);
                alert(`Registration Successful! ${res.data.message} Your Technician ID is: ${res.data.technician_id}.`);
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-surface-50 dark:bg-surface-950 relative overflow-hidden selection:bg-primary-500/30">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-primary-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-accent-500/10 rounded-full blur-[120px]" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-xl p-1 space-y-8 relative z-10 my-10"
            >
                <div className="text-center space-y-2 mb-8">
                    <motion.div 
                        initial={{ rotate: 10 }}
                        animate={{ rotate: 0 }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-[2rem] shadow-2xl shadow-primary-500/40 mb-2"
                    >
                        <User size={32} strokeWidth={2.5} />
                    </motion.div>
                    <h2 className="text-4xl font-black tracking-tight text-surface-900 dark:text-white uppercase italic">
                        Identity <span className="gradient-text">Registration</span>
                    </h2>
                    <p className="text-surface-500 font-bold uppercase tracking-widest text-xs">Join the SmartStay Ecosystem</p>
                </div>

                <div className="glass-card rounded-[3rem] p-10 border-white/20 dark:border-white/5 shadow-2xl">
                    <div className="flex p-1 bg-surface-100 dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 relative mb-10">
                        {[
                            { id: 'resident', label: 'Resident', icon: Home },
                            { id: 'technician', label: 'Technician', icon: Wrench }
                        ].map((roleOption) => (
                            <button
                                key={roleOption.id}
                                type="button"
                                onClick={() => setRole(roleOption.id)}
                                className={`relative flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-wider transition-all z-10 ${role === roleOption.id ? 'text-primary-600 dark:text-primary-400' : 'text-surface-500 hover:text-surface-700'}`}
                            >
                                <roleOption.icon size={14} />
                                {roleOption.label}
                                {role === roleOption.id && (
                                    <motion.div
                                        layoutId="reg-role-pill"
                                        className="absolute inset-0 bg-white dark:bg-surface-800 shadow-md rounded-[1.25rem]"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        style={{ zIndex: -1 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-sm font-bold text-rose-600 text-center"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-4">Full Identity Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                        <User className="text-surface-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        value={role === 'resident' ? residentData.name : techData.name}
                                        onChange={role === 'resident' ? handleResidentChange : handleTechChange}
                                        required
                                        className="w-full pl-14 pr-6 py-4 bg-surface-50 dark:bg-surface-800 border-none rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/20 transition-all font-bold text-surface-900 dark:text-white placeholder:text-surface-400"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-4">Official Phone</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                        <Phone className="text-surface-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="phone_number"
                                        placeholder="+91 00000 00000"
                                        value={role === 'resident' ? residentData.phone_number : techData.phone_number}
                                        onChange={role === 'resident' ? handleResidentChange : handleTechChange}
                                        required
                                        className="w-full pl-14 pr-6 py-4 bg-surface-50 dark:bg-surface-800 border-none rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/20 transition-all font-bold text-surface-900 dark:text-white placeholder:text-surface-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {role === 'resident' ? (
                                <motion.div 
                                    key="resident-fields"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-4">Email Address</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                                <Mail className="text-surface-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="john@example.com"
                                                value={residentData.email}
                                                onChange={handleResidentChange}
                                                className="w-full pl-14 pr-6 py-4 bg-surface-50 dark:bg-surface-800 border-none rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/20 transition-all font-bold text-surface-900 dark:text-white placeholder:text-surface-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-4">Flat Identity</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                                <Building className="text-surface-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                            </div>
                                            <input
                                                type="number"
                                                name="flat_id"
                                                placeholder="Unit No."
                                                value={residentData.flat_id}
                                                onChange={handleResidentChange}
                                                required
                                                className="w-full pl-14 pr-6 py-4 bg-surface-50 dark:bg-surface-800 border-none rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/20 transition-all font-bold text-surface-900 dark:text-white placeholder:text-surface-400"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="tech-fields"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-3"
                                >
                                    <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-4">Core Specialization</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                            <Wrench className="text-surface-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="specialization"
                                            placeholder="e.g. Master Plumbing, Electrical Engineering"
                                            value={techData.specialization}
                                            onChange={handleTechChange}
                                            required
                                            className="w-full pl-14 pr-6 py-4 bg-surface-50 dark:bg-surface-800 border-none rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/20 transition-all font-bold text-surface-900 dark:text-white placeholder:text-surface-400"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-5 text-sm font-black uppercase tracking-[0.2em] text-white bg-primary-600 rounded-[2rem] shadow-2xl shadow-primary-500/40 hover:bg-primary-700 transition-all flex items-center justify-center gap-3 mt-4"
                        >
                            Complete Registration
                            <ArrowRight size={18} strokeWidth={3} />
                        </motion.button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-surface-100 dark:border-surface-800 text-center">
                        <Link to="/login" className="text-xs font-bold text-surface-500 hover:text-primary-600 transition-colors">
                            Already have an official identity? <span className="underline">Authenticate here</span>
                        </Link>
                    </div>
                </div>

                <div className="text-center">
                    <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-surface-400 hover:text-primary-500 transition-colors flex items-center justify-center gap-2">
                         <ShieldCheck size={12} /> Privacy Preserved Platform v2.0
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;