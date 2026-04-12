import React, { useEffect, useState } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    BarChart, Bar,
} from 'recharts';
import api from '../api';

const COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#6366F1', '#EC4899'];

const AdminAnalysis = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="p-10 text-center text-gray-500">Loading analysis data...</div>;
    if (!data) return <div className="p-10 text-center text-red-500">Failed to load analysis data.</div>;

    const { statusStats, categoryStats, requestTrends, techPerformance, financialTrends } = data;

    // Formatting for Status Pie Chart
    const statusData = statusStats.map(s => ({ name: s.status, value: s.count }));
    
    // Formatting for Category Pie Chart
    const categoryData = categoryStats.map(c => ({ name: c.request_category, value: c.count }));

    // Formatting for Trends Area Chart
    const trendData = requestTrends.map(t => ({
        date: new Date(t.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        count: t.count
    }));

    // Formatting for Financial Trends
    const revenueData = financialTrends.map(f => ({
        date: new Date(f.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        cost: f.total_cost
    }));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Status Distribution */}
                <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-100">Request Status Distribution</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-100">Request Category Analysis</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Maintenance Request Trends */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl dark:bg-gray-800 dark:border-gray-700">
                <h3 className="mb-6 text-lg font-bold text-gray-800 dark:text-gray-100">Maintenance Request Trends (Last 30 Days)</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                            <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Area type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Technician Performance */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl dark:bg-gray-800 dark:border-gray-700">
                <h3 className="mb-6 text-lg font-bold text-gray-800 dark:text-gray-100">Technician Workload & Performance</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={techPerformance}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                            <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Legend />
                            <Bar dataKey="total_tasks" fill="#D1D5DB" radius={[4, 4, 0, 0]} name="Total Assigned" />
                            <Bar dataKey="completed_tasks" fill="#10B981" radius={[4, 4, 0, 0]} name="Completed" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Maintenance Cost Over Time */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl dark:bg-gray-800 dark:border-gray-700">
                <h3 className="mb-6 text-lg font-bold text-gray-800 dark:text-gray-100">Maintenance Costs Analysis</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} unit=" Rs" />
                            <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Bar dataKey="cost" fill="#6366F1" radius={[4, 4, 0, 0]} name="Daily Maintenance Cost" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalysis;
