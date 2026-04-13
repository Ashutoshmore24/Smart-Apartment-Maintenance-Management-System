import React, { useEffect, useState } from 'react';
import api, { getTechStats } from '../api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Search, Filter, Activity, Clock, Target, ListTodo, AlertTriangle, PlayCircle, RefreshCw, Sparkles } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import TaskCard from '../components/TaskCard';
import { motion, AnimatePresence } from 'framer-motion';

const TechnicianDashboard = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        completed_today: 0,
        avg_completion_hours: 0,
        efficiency_percentage: 100
    });

    const fetchData = async () => {
        if (!user || (!user.technician_id && user.role !== 'technician')) return;
        
        const techId = user.technician_id;
        if (!techId) return;

        try {
            const [reqRes, statRes] = await Promise.all([
                api.get(`/requests/technician/${techId}`),
                getTechStats(techId)
            ]);

            const list = reqRes.data;
            setRequests(Array.isArray(list) ? list : []);
            setStats(statRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === 'technician') {
            fetchData();
            // Auto refresh every 10 seconds
            const intervalId = setInterval(fetchData, 10000);
            return () => clearInterval(intervalId);
        }
    }, [user]);

    const handleComplete = async (id) => {
        const cost = prompt("Enter maintenance cost (Rs.):");
        if (!cost || isNaN(cost) || cost <= 0 || cost > 100000) {
            alert("Valid cost between 1 and 100,000 is required");
            return;
        }
        if (!window.confirm("Mark this task as completed?")) return;

        try {
            await api.put(`/requests/complete/${id}`, { cost });
            fetchData();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to complete request");
        }
    };

    const totalTasks = requests.length;
    const pendingTasks = requests.filter(r => r.status === 'PENDING').length;
    const inProgressTasks = requests.filter(r => r.status === 'IN_PROGRESS').length;
    const completedTasks = requests.filter(r => r.status === 'COMPLETED').length;
    const emergencyTasks = requests.filter(r => r.priority === 'EMERGENCY' && r.status !== 'COMPLETED').length;

    const filteredRequests = requests.filter(r => {
        const matchesSearch = 
            (r.resident_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
            (r.description || '').toLowerCase().includes(searchQuery.toLowerCase());
            
        if (!matchesSearch) return false;

        switch (filter) {
            case 'Pending': return r.status === 'PENDING';
            case 'In Progress': return r.status === 'IN_PROGRESS';
            case 'Completed': return r.status === 'COMPLETED';
            case 'Emergency': return r.priority === 'EMERGENCY' && r.status !== 'COMPLETED';
            default: return true;
        }
    });

    if (!user) return (
        <div className="flex items-center justify-center min-h-[60vh] text-surface-500 font-bold uppercase tracking-widest animate-pulse">
            Loading Technician Panel...
        </div>
    );

    return (
        <div className="px-6 py-12 mx-auto max-w-7xl selection:bg-primary-500/30">
            {/* Header & Performance Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-start justify-between gap-8 mb-12 lg:flex-row lg:items-end"
            >
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight text-surface-900 dark:text-white lg:text-5xl uppercase italic">
                        Technician <span className="gradient-text">Workspace</span>
                    </h1>
                    <p className="text-lg font-medium text-surface-500 dark:text-surface-400">
                        Operational Control Center for <span className="text-primary-600 dark:text-primary-400 font-black tracking-tight uppercase">{user.name}</span>
                    </p>
                </div>
                
                {/* Performance HUD */}
                <div className="flex gap-1 p-1 bg-surface-100 dark:bg-surface-900/50 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-inner">
                    {[
                        { label: 'Today', value: stats.completed_today, icon: Activity, color: 'text-emerald-500' },
                        { label: 'Avg Time', value: `${stats.avg_completion_hours}h`, icon: Clock, color: 'text-primary-500' },
                        { label: 'Target', value: `${stats.efficiency_percentage}%`, icon: Target, color: 'text-amber-500' },
                    ].map((hud, i) => (
                        <div key={i} className="flex flex-col items-center px-6 py-3 rounded-2xl bg-white dark:bg-surface-900 shadow-sm border border-surface-50 dark:border-surface-800">
                            <hud.icon className={`mb-1 ${hud.color}`} size={16} strokeWidth={3} />
                            <span className="text-2xl font-black text-surface-900 dark:text-white leading-none mb-1">{hud.value}</span>
                            <span className="text-[10px] font-black tracking-widest text-surface-400 uppercase">{hud.label}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-6 mb-12 sm:grid-cols-2 lg:grid-cols-5">
                <StatsCard title="Total Assigned" count={totalTasks} icon={ListTodo} colorClass="text-primary-600" bgColorClass="bg-primary-500/5" />
                <StatsCard title="Pending" count={pendingTasks} icon={AlertTriangle} colorClass="text-rose-600" bgColorClass="bg-rose-500/5" />
                <StatsCard title="In Progress" count={inProgressTasks} icon={PlayCircle} colorClass="text-amber-600" bgColorClass="bg-amber-500/5" />
                <StatsCard title="Completed" count={completedTasks} icon={CheckCircle} colorClass="text-emerald-600" bgColorClass="bg-emerald-500/5" />
                <StatsCard title="Emergency" count={emergencyTasks} icon={Sparkles} colorClass="text-rose-600" bgColorClass="bg-rose-500/10 border-rose-200 dark:border-rose-900/30" />
            </div>

            {/* View Controls */}
            <div className="flex flex-col items-center justify-between gap-6 p-3 glass-card rounded-[2rem] md:flex-row mb-8">
                <div className="flex w-full gap-2 p-1 overflow-x-auto md:w-auto hide-scrollbar">
                    {['All', 'Pending', 'In Progress', 'Completed', 'Emergency'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`relative px-6 py-3 text-xs font-black uppercase tracking-widest transition-all duration-300 rounded-2xl ${
                                filter === f 
                                ? 'text-primary-600 dark:text-primary-400' 
                                : 'text-surface-500 hover:text-surface-900 dark:hover:text-white'
                            }`}
                        >
                            <span className="relative z-10">{f}</span>
                            {filter === f && (
                                <motion.div
                                    layoutId="tech-filter-pill"
                                    className="absolute inset-0 bg-white dark:bg-surface-800 shadow-lg rounded-2xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    style={{ zIndex: 0 }}
                                />
                            )}
                        </button>
                    ))}
                </div>
                
                <div className="relative w-full md:w-80">
                    <Search className="absolute text-surface-400 transform -translate-y-1/2 left-4 top-1/2" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search residents or issues..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-4 pl-12 pr-6 text-sm font-bold bg-surface-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all dark:bg-surface-800 dark:text-white shadow-inner"
                    />
                </div>
            </div>

            {/* Task Execution Area */}
            <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                    {loading && requests.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="p-20 flex flex-col items-center gap-4"
                        >
                            <RefreshCw className="text-primary-500 animate-spin" size={40} />
                            <span className="font-black text-xs uppercase tracking-[0.3em] text-surface-400">Syncing Data...</span>
                        </motion.div>
                    ) : filteredRequests.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-20 text-center glass-card border-dashed rounded-[3rem] border-surface-200 dark:border-surface-800"
                        >
                            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={32} strokeWidth={3} />
                            </div>
                            <h3 className="text-2xl font-black text-surface-900 dark:text-white uppercase tracking-tight">System Optimized</h3>
                            <p className="mt-2 text-surface-500 font-medium">All tasks in current filter have been reconciled.</p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {filteredRequests.map(req => (
                                <TaskCard key={req.request_id} task={req} onComplete={handleComplete} />
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TechnicianDashboard;