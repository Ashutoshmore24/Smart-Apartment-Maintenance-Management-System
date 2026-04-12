/* Everything Ready */
import React, { useEffect, useState, useMemo } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    BarChart, Bar, Sector
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, CheckCircle, Clock, Zap, DollarSign } from 'lucide-react';
import api from '../api';

const COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#6366F1', '#EC4899'];

// --- Custom Components for Recharts ---

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-lg font-bold">
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 10}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 12}
                outerRadius={outerRadius + 15}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#9CA3AF" className="text-xs">{`Count: ${value}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#6B7280" className="text-xs font-medium">
                {`(${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};

const CustomTooltip = ({ active, payload, label, unit = "" }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-4 bg-white border border-gray-100 shadow-xl rounded-2xl dark:bg-gray-800 dark:border-gray-700 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
                <p className="mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {entry.name}: <span className="text-blue-600 dark:text-blue-400">{entry.value}{unit}</span>
                        </p>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// --- Main Component ---

const AdminAnalysis = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeStatusIndex, setActiveStatusIndex] = useState(0);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/requests/stats/admin');
                setData(res.data);
            } catch (err) {
                console.error("Error fetching admin stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const kpis = useMemo(() => {
        if (!data) return [];
        const totalReq = data.statusStats.reduce((acc, curr) => acc + curr.count, 0);
        const completed = data.statusStats.find(s => s.status === 'COMPLETED')?.count || 0;
        const totalCost = data.financialTrends.reduce((acc, curr) => acc + parseFloat(curr.total_cost || 0), 0);
        const efficiency = totalReq > 0 ? Math.round((completed / totalReq) * 100) : 100;
        
        return [
            { label: 'Total Requests', value: totalReq, icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Efficiency', value: `${efficiency}%`, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
            { label: 'Total Cost', value: `₹${totalCost.toLocaleString()}`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
            { label: 'Technicians', value: data.techPerformance.length, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        ];
    }, [data]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-gray-500 animate-pulse">Synchronizing analysis data...</p>
        </div>
    );

    if (!data) return <div className="p-10 text-center text-red-500">Failed to load analysis data. Please refresh.</div>;

    const { statusStats, categoryStats, requestTrends, techPerformance, financialTrends } = data;

    const trendData = requestTrends.map(t => ({
        date: new Date(t.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        count: t.count
    }));

    const revenueData = financialTrends.map(f => ({
        date: new Date(f.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        cost: f.total_cost
    }));

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 animate-in fade-in duration-500 pb-12"
        >
            {/* KPI Section */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {kpis.map((kpi, i) => (
                    <motion.div 
                        key={i} 
                        variants={cardVariants}
                        whileHover={{ y: -5 }}
                        className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl dark:bg-gray-800 dark:border-gray-700 flex items-center gap-4"
                    >
                        <div className={`p-3 rounded-xl ${kpi.bg}`}>
                            <kpi.icon className={kpi.color} size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{kpi.label}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Status Distribution with Active Shape */}
                <motion.div variants={cardVariants} className="p-8 bg-white border border-gray-100 shadow-sm rounded-3xl dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Task Lifecycle</h3>
                        <Zap className="text-blue-500" size={20} />
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    activeIndex={activeStatusIndex}
                                    activeShape={renderActiveShape}
                                    data={statusStats.map(s => ({ name: s.status, value: s.count }))}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                    onMouseEnter={(_, index) => setActiveStatusIndex(index)}
                                >
                                    {statusStats.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Maintenance Cost Trends */}
                <motion.div variants={cardVariants} className="p-8 bg-white border border-gray-100 shadow-sm rounded-3xl dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Financial Insights</h3>
                        <TrendingUp className="text-purple-500" size={20} />
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.3} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} unit="₹" />
                                <Tooltip content={<CustomTooltip unit="₹" />} />
                                <Area type="monotone" dataKey="cost" stroke="#6366F1" strokeWidth={4} fillOpacity={1} fill="url(#colorCost)" dot={{ r: 4, fill: '#6366F1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Request Trends */}
            <motion.div variants={cardVariants} className="p-8 bg-white border border-gray-100 shadow-sm rounded-3xl dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Maintenance Velocity</h3>
                        <p className="text-sm text-gray-500">Request volume tracking for the last 30 days</p>
                    </div>
                    <Clock className="text-orange-500" size={20} />
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.3} />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} dy={15} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="stepAfter" dataKey="count" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Tech Performance */}
            <motion.div variants={cardVariants} className="p-8 bg-white border border-gray-100 shadow-sm rounded-3xl dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Technician Efficiency</h3>
                        <p className="text-sm text-gray-500">Comparing assignment load vs. successful closures</p>
                    </div>
                    <Users className="text-green-500" size={20} />
                </div>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={techPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.3} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} angle={-45} textAnchor="end" dy={20} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} />
                            <Tooltip cursor={{fill: 'rgba(59, 130, 246, 0.05)'}} content={<CustomTooltip />} />
                            <Legend verticalAlign="top" height={36}/>
                            <Bar dataKey="total_tasks" fill="#D1D5DB" radius={[6, 6, 0, 0]} barSize={24} name="Total Load" />
                            <Bar dataKey="completed_tasks" fill="#10B981" radius={[6, 6, 0, 0]} barSize={24} name="Resolved" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AdminAnalysis;
