import React, { useEffect, useState } from 'react';
import api from '../api';
import StatusBadge from '../components/StatusBadge';
import AdminAnalysis from '../components/AdminAnalysis';
import StatsCard from '../components/StatsCard';
import { User, CheckCircle, Search, BarChart2, Users, ClipboardList, Clock, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [allTechnicians, setAllTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'technicians' | 'analysis'

    // Search states
    const [requestSearch, setRequestSearch] = useState('');
    const [techSearch, setTechSearch] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [reqRes, techRes, allTechRes] = await Promise.all([
                api.get('/requests'),
                api.get('/users/technicians'),
                api.get('/users/technicians/all')
            ]);
            setRequests(reqRes.data);
            setTechnicians(techRes.data);
            setAllTechnicians(allTechRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAssign = async (requestId, technicianId) => {
        if (!technicianId) return;
        try {
            await api.put(`/requests/${requestId}`, {
                status: 'IN_PROGRESS',
                technician_id: technicianId
            });
            fetchData();
            alert('Technician assigned successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to assign technician');
        }
    };

    const handleAutoAssign = async () => {
        try {
            const res = await api.post("/requests/auto-assign");
            alert(res.data.message);
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Auto assignment failed");
        }
    };

    const hasUnassigned = requests.some(
        r => !r.technician_id && r.status === 'PENDING'
    );

    const handleTechStatus = async (techId, newStatus) => {
        try {
            await api.put(`/users/technicians/${techId}/status`, { status: newStatus });
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Failed to update status");
        }
    };

    const filteredRequests = requests.filter(req => {
        const query = requestSearch.toLowerCase();
        return (
            (req.resident_name && req.resident_name.toLowerCase().includes(query)) ||
            (req.technician_name && req.technician_name.toLowerCase().includes(query)) ||
            (req.request_type && req.request_type.toLowerCase().includes(query))
        );
    });

    const filteredTechnicians = allTechnicians.filter(tech => {
        const query = techSearch.toLowerCase();
        return (
            (tech.name && tech.name.toLowerCase().includes(query)) ||
            (tech.specialization && tech.specialization.toLowerCase().includes(query))
        );
    });

    const stats = [
        { title: "Total Requests", count: requests.length, icon: ClipboardList, colorClass: "text-primary-600", bgColorClass: "bg-primary-500/5" },
        { title: "Pending", count: requests.filter(r => r.status === 'PENDING').length, icon: Clock, colorClass: "text-rose-600", bgColorClass: "bg-rose-500/5" },
        { title: "In Progress", count: requests.filter(r => r.status === 'IN_PROGRESS').length, icon: RefreshCw, colorClass: "text-amber-600", bgColorClass: "bg-amber-500/5" },
        { title: "Completed", count: requests.filter(r => r.status === 'COMPLETED').length, icon: CheckCircle2, colorClass: "text-emerald-600", bgColorClass: "bg-emerald-500/5" },
    ];

    return (
        <div className="px-6 py-12 mx-auto max-w-7xl selection:bg-primary-500/30">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-start justify-between gap-6 mb-12 md:flex-row md:items-end"
            >
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-surface-900 dark:text-white lg:text-5xl">
                        Admin <span className="gradient-text">Dashboard</span>
                    </h1>
                    <p className="mt-2 text-lg font-medium text-surface-500 dark:text-surface-400">
                        Oversee operations across the entire maintenance network.
                    </p>
                </div>

                <div className="flex gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAutoAssign}
                        disabled={!hasUnassigned}
                        className={`flex items-center gap-2 px-6 py-3.5 text-sm font-black rounded-2xl shadow-xl transition-all ${hasUnassigned
                                ? 'bg-primary-600 text-white shadow-primary-500/30 hover:bg-primary-700'
                                : 'bg-surface-200 text-surface-400 cursor-not-allowed dark:bg-surface-800'
                            }`}
                    >
                        <Sparkles size={18} />
                        Auto-Assign
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={fetchData}
                        className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-surface-700 bg-white border border-surface-200 rounded-2xl shadow-sm hover:border-primary-300 transition-all dark:bg-surface-900 dark:border-surface-800 dark:text-surface-300"
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </motion.button>
                </div>
            </motion.div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-6 mb-12 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((s, i) => (
                    <StatsCard key={i} {...s} />
                ))}
            </div>

            {/* Tabs Navigation */}
            <div className="flex mb-8 space-x-2 bg-surface-100 dark:bg-surface-900/50 p-2 rounded-[1.5rem] w-fit">
                {[
                    { id: 'requests', label: 'Requests', icon: ClipboardList },
                    { id: 'technicians', label: 'Fleet Management', icon: Users },
                    { id: 'analysis', label: 'Data Analysis', icon: BarChart2 }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-wider transition-all rounded-2xl ${activeTab === tab.id ? 'text-primary-600 dark:text-primary-400' : 'text-surface-500 hover:text-surface-700'}`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="admin-tab-pill"
                                className="absolute inset-0 bg-white dark:bg-surface-800 shadow-sm rounded-2xl"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                style={{ zIndex: -1 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'requests' && (
                        <div className="glass-card rounded-[2.5rem] border-surface-100 dark:border-surface-800 overflow-hidden">
                            <div className="flex flex-col gap-6 p-8 border-b border-surface-100 dark:border-surface-800 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="text-2xl font-black text-surface-900 dark:text-white">Maintenance Ledger</h2>
                                <div className="relative w-full sm:w-80">
                                    <Search className="absolute text-surface-400 transform -translate-y-1/2 left-4 top-1/2" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search across all fields..."
                                        value={requestSearch}
                                        onChange={(e) => setRequestSearch(e.target.value)}
                                        className="w-full py-4 pl-12 pr-6 text-sm font-bold bg-surface-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all dark:bg-surface-800 dark:text-white shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-[10px] font-black uppercase tracking-widest text-surface-400 bg-surface-50/50 dark:bg-surface-800/50">
                                        <tr>
                                            <th className="px-8 py-5 text-center">Reference</th>
                                            <th className="px-8 py-5">Resident</th>
                                            <th className="px-8 py-5">Request Details</th>
                                            <th className="px-8 py-5 text-center">Status</th>
                                            <th className="px-8 py-5">Assigned To</th>
                                            <th className="px-8 py-5">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                                        {filteredRequests.map(req => (
                                            <tr key={req.request_id} className="group hover:bg-primary-50/30 dark:hover:bg-primary-900/5 transition-colors">
                                                <td className="px-8 py-6 text-center font-black text-xs text-primary-600 dark:text-primary-400">
                                                    #{req.request_id}
                                                </td>
                                                <td className="px-8 py-6 font-bold text-surface-900 dark:text-white">
                                                    {req.resident_name}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="font-black text-xs uppercase tracking-tight text-surface-900 dark:text-white">{req.request_type}</div>
                                                    <div className="text-xs font-medium text-surface-500 dark:text-surface-400 mt-1 max-w-[200px] truncate">{req.description || 'No description provided'}</div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <StatusBadge status={req.status} />
                                                </td>
                                                <td className="px-8 py-6">
                                                    {req.technician_name ? (
                                                        <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                                                            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                                <User size={12} />
                                                            </div>
                                                            {req.technician_name}
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-surface-400 italic">Unassigned</span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6">
                                                    {req.status !== 'COMPLETED' ? (
                                                        <div className="relative group/assign">
                                                            <select
                                                                className="appearance-none w-full px-4 py-2 text-xs font-bold bg-white border border-surface-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 transition-all dark:bg-surface-800 dark:border-surface-700 dark:text-white cursor-pointer hover:border-primary-400 pr-8"
                                                                onChange={(e) => handleAssign(req.request_id, e.target.value)}
                                                                defaultValue=""
                                                                disabled={!!req.technician_id}
                                                            >
                                                                <option value="" disabled>Change Tech</option>
                                                                {technicians.map(t => (
                                                                    <option key={t.technician_id} value={t.technician_id}>
                                                                        {t.name} ({t.specialization || 'General'})
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" size={14} />
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-center">
                                                            <CheckCircle2 size={24} className="text-emerald-500" strokeWidth={3} />
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'technicians' && (
                        <div className="glass-card rounded-[2.5rem] border-surface-100 dark:border-surface-800 overflow-hidden">
                            <div className="flex flex-col gap-6 p-8 border-b border-surface-100 dark:border-surface-800 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="text-2xl font-black text-surface-900 dark:text-white">Active Fleet</h2>
                                <div className="relative w-full sm:w-80">
                                    <Search className="absolute text-surface-400 transform -translate-y-1/2 left-4 top-1/2" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search specialists..."
                                        value={techSearch}
                                        onChange={(e) => setTechSearch(e.target.value)}
                                        className="w-full py-4 pl-12 pr-6 text-sm font-bold bg-surface-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all dark:bg-surface-800 dark:text-white shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-[10px] font-black uppercase tracking-widest text-surface-400 bg-surface-50/50 dark:bg-surface-800/50">
                                        <tr>
                                            <th className="px-8 py-5 uppercase tracking-[0.2em]">Technician</th>
                                            <th className="px-8 py-5 uppercase tracking-[0.2em]">Craft</th>
                                            <th className="px-8 py-5 uppercase tracking-[0.2em] text-center">Workload</th>
                                            <th className="px-8 py-5 uppercase tracking-[0.2em] text-center">Efficiency</th>
                                            <th className="px-8 py-5 uppercase tracking-[0.2em]">System Status</th>
                                            <th className="px-8 py-5 uppercase tracking-[0.2em]">Management</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                                        {filteredTechnicians.map(t => (
                                            <tr key={t.technician_id} className="group hover:bg-primary-50/30 dark:hover:bg-primary-900/5 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-600 dark:text-surface-400 font-black">
                                                            {t.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-surface-900 dark:text-white">{t.name}</div>
                                                            <div className="text-xs font-bold text-surface-400">{t.phone_number}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="px-3 py-1 bg-surface-100 dark:bg-surface-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-surface-600 dark:text-surface-400">
                                                        {t.specialization || 'Generalist'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <span className="text-lg font-black text-primary-600 dark:text-primary-400">{t.total_assigned || 0}</span>
                                                    <span className="text-xs font-bold text-surface-400 ml-1">tasks</span>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{t.total_completed || 0}</span>
                                                    <span className="text-xs font-bold text-surface-400 ml-1">done</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${
                                                        t.status === 'APPROVED' 
                                                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                                                            : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                                    }`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${t.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                        {t.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        {t.status === 'PENDING' && (
                                                            <>
                                                                <button onClick={() => handleTechStatus(t.technician_id, 'APPROVED')} className="px-4 py-2 text-xs font-black uppercase tracking-widest text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all">Approve</button>
                                                                <button onClick={() => handleTechStatus(t.technician_id, 'REJECTED')} className="px-4 py-2 text-xs font-black uppercase tracking-widest text-rose-600 hover:text-rose-700 transition-colors">Reject</button>
                                                            </>
                                                        )}
                                                        {t.status === 'APPROVED' && (
                                                            <button onClick={() => handleTechStatus(t.technician_id, 'REJECTED')} className="px-4 py-2 text-xs font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-all">Deactivate</button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'analysis' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                             <AdminAnalysis />
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
