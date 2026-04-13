import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import RequestList from '../components/RequestList';
import { Filter, RefreshCw, Plus, X, ClipboardList, CheckCircle2, Clock, Wallet } from 'lucide-react';
import { getResidentStats } from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const flatTasks = [
    "Plumbing", "Electrical", "Carpentry", "Painting", "HVAC", 
    "Appliance Repair", "General Maintenance", "Gardening"
];

const assetTasks = [
    "Breakdown", "Inspection", "Noise Issue", "Emergency Repair", "Routine Maintenance"
];

const DashboardPage = () => {
    const { user, role } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [newRequest, setNewRequest] = useState({
        type: 'Plumbing',
        description: '',
        category: 'FLAT',
        asset_id: null
    });

    const [assets, setAssets] = useState([]);
    const [stats, setStats] = useState({
        total_requests: 0,
        pending_actions: 0,
        resolved: 0,
        pending_payments: 0
    });

    const fetchStats = async () => {
        if (!user?.resident_id) return;
        try {
            const res = await getResidentStats(user.resident_id);
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAssets = async () => {
        try {
            const res = await api.get('/assets');
            setAssets(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRequests = () => {
        setLoading(true);
        api.get("/requests")
            .then(res => {
                if (role === 'resident' && user) {
                    const myRequests = res.data.filter(r => Number(r.resident_id) === Number(user.resident_id));
                    setRequests(myRequests);
                } else {
                    setRequests(res.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchRequests();
        fetchAssets();
        fetchStats();
    }, [user]);

    useEffect(() => {
        const handlePaymentUpdate = () => fetchStats();
        window.addEventListener("payment-updated", handlePaymentUpdate);
        return () => window.removeEventListener("payment-updated", handlePaymentUpdate);
    }, []);

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        try {
            await api.post('/requests', {
                resident_id: user.resident_id,
                request_type: newRequest.type,
                description: newRequest.description,
                request_category: newRequest.category,
                asset_id: newRequest.category === 'ASSET' ? newRequest.asset_id : null
            });
            setShowModal(false);
            fetchRequests();
            fetchStats();
            setNewRequest({ type: 'Plumbing', description: '', category: 'FLAT', asset_id: null });
            alert('Request submitted successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to submit request');
        }
    };

    const filteredRequests = filter === 'All' ? requests : requests.filter(r => r.status === filter);

    if (!user) return (
        <div className="flex items-center justify-center min-h-[60vh] text-surface-500 font-bold uppercase tracking-widest animate-pulse">
            Establishing Secure Session...
        </div>
    );

    const statCards = [
        { label: 'Total Requests', value: stats.total_requests, icon: ClipboardList, color: 'text-primary-500', bg: 'bg-primary-500/10' },
        { label: 'Pending Actions', value: stats.pending_actions, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Pending Payments', value: stats.pending_payments, icon: Wallet, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    ];

    return (
        <div className="px-6 py-12 mx-auto max-w-7xl selection:bg-primary-500/30">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-start justify-between gap-6 mb-12 md:flex-row md:items-end"
            >
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight text-surface-900 dark:text-white lg:text-5xl">
                        Resident <span className="gradient-text">Dashboard</span>
                    </h1>
                    <p className="text-lg font-medium text-surface-500 dark:text-surface-400">
                        Welcome back, <span className="text-primary-600 dark:text-primary-400 font-bold">{user.name}</span>.
                    </p>
                </div>

                <div className="flex gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-6 py-3.5 text-sm font-black text-white bg-primary-600 rounded-2xl shadow-xl shadow-primary-500/30 hover:bg-primary-700 transition-all"
                    >
                        <Plus size={18} />
                        New Request
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { fetchRequests(); fetchStats(); }}
                        className="flex items-center gap-2 px-5 py-3.5 text-sm font-bold text-surface-700 bg-white border border-surface-200 rounded-2xl shadow-sm hover:border-primary-300 transition-all dark:bg-surface-900 dark:border-surface-800 dark:text-surface-300"
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </motion.button>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 glass-card rounded-[2rem] border-surface-100 dark:border-surface-800 flex flex-col justify-between"
                    >
                        <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center mb-6`}>
                            <card.icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                        <div>
                            <div className="text-xs font-black uppercase tracking-widest text-surface-400 mb-1">{card.label}</div>
                            <div className="text-4xl font-black text-surface-900 dark:text-white">{card.value}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Filter Tabs & Content */}
            <div className="bg-white/50 dark:bg-surface-900/50 rounded-[2.5rem] border border-surface-100 dark:border-surface-800 overflow-hidden shadow-2xl">
                <div className="flex flex-wrap items-center gap-4 px-8 py-6 border-b border-surface-100 dark:border-surface-800">
                    <Filter size={18} className="text-surface-400 mr-2" />
                    {['All', 'PENDING', 'IN_PROGRESS', 'COMPLETED'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${filter === status
                                    ? 'text-primary-600 dark:text-primary-400'
                                    : 'text-surface-500 hover:text-surface-900 dark:hover:text-surface-200'
                                }`}
                        >
                            <span className="relative z-10">
                                {status === 'IN_PROGRESS' ? 'In Progress' : status.charAt(0) + status.slice(1).toLowerCase()}
                            </span>
                            {filter === status && (
                                <motion.div
                                    layoutId="filter-pill"
                                    className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-2">
                    <RequestList requests={filteredRequests} loading={loading} />
                </div>
            </div>

            {/* New Request Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-surface-950/60 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-xl p-10 bg-white dark:bg-surface-900 rounded-[3rem] shadow-2xl border border-white/20"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-3xl font-black text-surface-900 dark:text-white uppercase tracking-tight">New Request</h3>
                                    <p className="text-surface-500 font-medium">Please provide the details below.</p>
                                </div>
                                <motion.button 
                                    whileHover={{ rotate: 90 }}
                                    onClick={() => setShowModal(false)} 
                                    className="p-3 text-surface-400 hover:text-surface-900 dark:hover:text-white bg-surface-100 dark:bg-surface-800 rounded-2xl transition-colors"
                                >
                                    <X size={24} />
                                </motion.button>
                            </div>

                            <form onSubmit={handleSubmitRequest} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-2">Request Category</label>
                                        <select
                                            className="w-full px-5 py-4 bg-surface-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-bold text-surface-900 dark:bg-surface-800 dark:text-white"
                                            value={newRequest.category}
                                            onChange={(e) =>
                                                setNewRequest({
                                                    ...newRequest,
                                                    category: e.target.value,
                                                    asset_id: null,
                                                    type: e.target.value === 'FLAT' ? 'Plumbing' : 'Breakdown'
                                                })
                                            }
                                        >
                                            <option value="FLAT">Flat Maintenance</option>
                                            <option value="ASSET">Common Assets</option>
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-2">Problem Type</label>
                                        <select
                                            className="w-full px-5 py-4 bg-surface-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-bold text-surface-900 dark:bg-surface-800 dark:text-white"
                                            value={newRequest.type}
                                            onChange={e => setNewRequest({ ...newRequest, type: e.target.value })}
                                        >
                                            {(newRequest.category === "FLAT" ? flatTasks : assetTasks).map(task => (
                                                <option key={task} value={task}>{task}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {newRequest.category === 'ASSET' && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-2">Select Asset</label>
                                        <select
                                            className="w-full px-5 py-4 bg-surface-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-bold text-surface-900 dark:bg-surface-800 dark:text-white"
                                            value={newRequest.asset_id || ''}
                                            onChange={(e) => setNewRequest({ ...newRequest, asset_id: e.target.value })}
                                            required
                                        >
                                            <option value="">-- Choose Asset --</option>
                                            {assets.map(asset => (
                                                <option key={asset.asset_id} value={asset.asset_id}>{asset.asset_name}</option>
                                            ))}
                                        </select>
                                    </motion.div>
                                )}

                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-2">Description</label>
                                    <textarea
                                        className="w-full px-6 py-5 bg-surface-50 border-none rounded-[2rem] focus:ring-4 focus:ring-primary-500/20 transition-all font-medium text-surface-900 dark:bg-surface-800 dark:text-white placeholder:text-surface-400"
                                        rows="4"
                                        value={newRequest.description}
                                        onChange={e => setNewRequest({ ...newRequest, description: e.target.value })}
                                        placeholder="Briefly describe the issue..."
                                        required
                                    ></textarea>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full py-5 text-lg font-black text-white bg-primary-600 rounded-[2rem] shadow-2xl shadow-primary-500/40 hover:bg-primary-700 transition-all mt-4"
                                >
                                    Submit Request
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardPage;
