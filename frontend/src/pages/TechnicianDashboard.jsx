/* Everything Ready */
import React, { useEffect, useState } from 'react';
import api, { getTechStats } from '../api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Search, Filter, Activity, Clock, Target, ListTodo, AlertTriangle, PlayCircle } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import TaskCard from '../components/TaskCard';

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

    // Calculate Dashboard Top Summary stats from the requests list locally
    const totalTasks = requests.length;
    const pendingTasks = requests.filter(r => r.status === 'PENDING').length;
    const inProgressTasks = requests.filter(r => r.status === 'IN_PROGRESS').length;
    const completedTasks = requests.filter(r => r.status === 'COMPLETED').length;
    const emergencyTasks = requests.filter(r => r.priority === 'EMERGENCY' && r.status !== 'COMPLETED').length;

    // Filtering & Searching Logic
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

    if (!user) return null;

    return (
        <div className="px-4 py-8 mx-auto space-y-8 max-w-7xl">
            {/* Header & Performance Section */}
            <div className="flex flex-col justify-between gap-6 lg:flex-row">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Technician Workspace</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Welcome back, {user.name}.</p>
                </div>
                
                {/* Technician Performance Card */}
                <div className="flex gap-6 p-4 border border-blue-100 shadow-sm rounded-xl bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/40 dark:to-gray-800 shrink-0">
                    <div className="flex flex-col items-center px-4 border-r border-blue-200 dark:border-blue-800/50">
                        <Activity className="mb-1 text-blue-600" size={20}/>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed_today}</span>
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Done Today</span>
                    </div>
                    <div className="flex flex-col items-center px-4 border-r border-blue-200 dark:border-blue-800/50">
                        <Clock className="mb-1 text-blue-600" size={20}/>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avg_completion_hours}h</span>
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Avg Time</span>
                    </div>
                    <div className="flex flex-col items-center px-4">
                        <Target className="mb-1 text-blue-600" size={20}/>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.efficiency_percentage}%</span>
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Efficiency</span>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                <StatsCard title="Total" count={totalTasks} icon={ListTodo} colorClass="text-blue-600" bgColorClass="bg-white dark:bg-gray-800" />
                <StatsCard title="Pending" count={pendingTasks} icon={AlertTriangle} colorClass="text-amber-500" bgColorClass="bg-white dark:bg-gray-800" />
                <StatsCard title="In Progress" count={inProgressTasks} icon={PlayCircle} colorClass="text-indigo-500" bgColorClass="bg-white dark:bg-gray-800" />
                <StatsCard title="Completed" count={completedTasks} icon={CheckCircle} colorClass="text-emerald-500" bgColorClass="bg-white dark:bg-gray-800" />
                <StatsCard title="Emergency" count={emergencyTasks} icon={Activity} colorClass="text-red-500" bgColorClass="bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30" />
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col items-center justify-between gap-4 p-2 bg-gray-100 shadow-inner md:flex-row rounded-xl dark:bg-gray-800/80">
                <div className="flex w-full gap-1 p-1 overflow-x-auto md:w-auto hide-scrollbar">
                    {['All', 'Pending', 'In Progress', 'Completed', 'Emergency'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-all duration-200 ${
                                filter === f 
                                ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/5 dark:bg-blue-600 dark:text-white dark:ring-0' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                
                <div className="relative w-full px-2 mt-2 md:w-72 md:mt-0 md:px-0">
                    <Search className="absolute text-gray-400 transform -translate-y-1/2 left-4 md:left-2 top-1/2" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search resident or issue..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-2 pl-10 pr-4 text-sm placeholder-gray-400 bg-white border-0 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                    />
                </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
                {loading && requests.length === 0 ? (
                    <div className="p-12 font-medium text-center text-gray-500 dark:text-gray-400 animate-pulse">
                        Loading workspace...
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="p-12 text-center bg-white border-2 border-gray-200 border-dashed rounded-2xl dark:bg-gray-800 dark:border-gray-700">
                        <CheckCircle className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={48} />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">All Caught Up!</h3>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">No tasks match the current filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredRequests.map(req => (
                            <TaskCard key={req.request_id} task={req} onComplete={handleComplete} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TechnicianDashboard;