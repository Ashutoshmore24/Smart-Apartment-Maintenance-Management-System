import React, { useState } from "react";
import { loginResident, loginTechnician } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleButton from "../components/GoogleButton";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, ArrowRight, ShieldCheck, Mail, Building } from "lucide-react";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        id: "",
        role: "resident",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            let user = null;
            let role = formData.role;

            if (role === "resident") {
                const res = await loginResident({
                    name: formData.name,
                    resident_id: formData.id,
                });

                user = res.data.user;
                user.resident_id = parseInt(user.resident_id || formData.id, 10);
            } else if (role === "admin") {
                if (formData.name === "admin" && formData.id === "admin123") {
                    user = { name: "Admin", role: "admin" };
                } else {
                    throw new Error("Invalid Admin Credentials");
                }
            } else if (role === "technician") {
                const res = await loginTechnician({
                    name: formData.name,
                    technician_id: formData.id,
                });

                user = res.data.user;
                user.role = "technician";
            }

            if (user) {
                login(user, role);
                if (role === "resident") navigate("/dashboard");
                if (role === "admin") navigate("/admin-dashboard");
                if (role === "technician") navigate("/technician-dashboard");
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message || "Login failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-surface-50 dark:bg-surface-950 relative overflow-hidden selection:bg-primary-500/30">
            {/* Background Gradient Blurs */}
            <div className="absolute top-[-10%] right-[-10%] w-1/2 h-1/2 bg-primary-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-1/2 h-1/2 bg-accent-500/10 rounded-full blur-[120px]" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-lg p-1 space-y-8 relative z-10"
            >
                <div className="text-center space-y-2 mb-8">
                    <motion.div 
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 0 }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-[2rem] shadow-2xl shadow-primary-500/40 mb-2"
                    >
                        <Building size={32} strokeWidth={2.5} />
                    </motion.div>
                    <h2 className="text-4xl font-black tracking-tight text-surface-900 dark:text-white uppercase italic">
                        Access <span className="gradient-text">Portal</span>
                    </h2>
                    <p className="text-surface-500 font-bold uppercase tracking-widest text-xs">Secure Authorization Required</p>
                </div>

                <div className="glass-card rounded-[3rem] p-10 border-white/20 dark:border-white/5 shadow-2xl">
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
                        {/* Role Selector */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-4">Authorized Role</label>
                            <div className="flex p-1 bg-surface-100 dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 relative">
                                {['resident', 'technician', 'admin'].map((roleOption) => (
                                    <button
                                        key={roleOption}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: roleOption })}
                                        className={`relative flex-1 py-3 text-xs font-black uppercase tracking-wider transition-all z-10 ${formData.role === roleOption ? 'text-primary-600 dark:text-primary-400' : 'text-surface-500 hover:text-surface-700'}`}
                                    >
                                        {roleOption}
                                        {formData.role === roleOption && (
                                            <motion.div
                                                layoutId="login-role-pill"
                                                className="absolute inset-0 bg-white dark:bg-surface-800 shadow-md rounded-[1.25rem]"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                style={{ zIndex: -1 }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Name Input */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-4">
                                {formData.role === "admin" ? "Username" : "Full Identity Name"}
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                    <User className="text-surface-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder={formData.role === "admin" ? "admin" : "Enter full name"}
                                    required
                                    className="w-full pl-14 pr-6 py-5 bg-surface-50 dark:bg-surface-800 border-none rounded-[2rem] focus:ring-4 focus:ring-primary-500/20 transition-all font-bold text-surface-900 dark:text-white placeholder:text-surface-400"
                                />
                            </div>
                        </div>

                        {/* ID / Password Input */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-4">
                                {formData.role === "admin" ? "Security Credential" : `${formData.role} identifier`}
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                    <Lock className="text-surface-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                </div>
                                <input
                                    type={formData.role === "admin" ? "password" : "text"}
                                    name="id"
                                    value={formData.id}
                                    onChange={handleChange}
                                    placeholder={formData.role === "admin" ? "••••••••" : "Enter official ID"}
                                    required
                                    className="w-full pl-14 pr-6 py-5 bg-surface-50 dark:bg-surface-800 border-none rounded-[2rem] focus:ring-4 focus:ring-primary-500/20 transition-all font-bold text-surface-900 dark:text-white placeholder:text-surface-400"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-5 text-sm font-black uppercase tracking-[0.2em] text-white bg-primary-600 rounded-[2rem] shadow-2xl shadow-primary-500/40 hover:bg-primary-700 transition-all flex items-center justify-center gap-3"
                        >
                            Authorize Session
                            <ArrowRight size={18} strokeWidth={3} />
                        </motion.button>
                    </form>

                    {/* Footer Actions */}
                    <div className="mt-10 space-y-6">
                        {formData.role === "resident" && (
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-100 dark:border-surface-800"></div></div>
                                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="px-4 bg-white dark:bg-surface-900 text-surface-400">OAuth verification</span></div>
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            {formData.role === "resident" && <GoogleButton />}
                            
                            {formData.role === "resident" && (
                                <Link
                                    to="/register"
                                    className="text-center text-xs font-bold text-surface-500 hover:text-primary-600 transition-colors"
                                >
                                    Don't have an identity yet? <span className="underline">Register here</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-surface-400 hover:text-primary-500 transition-colors flex items-center justify-center gap-2">
                         <ShieldCheck size={12} /> Encrypted Platform v2.0
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;