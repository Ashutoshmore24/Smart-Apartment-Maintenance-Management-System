/* Everything Ready */
import React, { useEffect, useState } from 'react';
import api from '../api';
import StatusBadge from '../components/StatusBadge';
import AdminAnalysis from '../components/AdminAnalysis';
import { User, CheckCircle, Search, BarChart2 } from 'lucide-react';

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

    return (
        <div className="px-6 py-8 mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-300">Manage all maintenance requests and technician assignments</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleAutoAssign}
                        disabled={!hasUnassigned}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${hasUnassigned
                                ? 'bg-purple-600 hover:bg-purple-700'
                                : 'bg-gray-400 cursor-not-allowed dark:bg-gray-600'
                            }`}
                    >
                        Auto Assign Technician
                    </button>

                    <button
                        onClick={fetchData}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
                <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700">
                    <div className="mb-1 text-sm font-medium text-gray-500 uppercase dark:text-gray-400">Total</div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{requests.length}</div>
                </div>
                <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700">
                    <div className="mb-1 text-sm font-medium text-gray-500 uppercase dark:text-gray-400">Pending</div>
                    <div className="text-3xl font-bold text-red-600">{requests.filter(r => r.status === 'PENDING').length}</div>
                </div>
                <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700">
                    <div className="mb-1 text-sm font-medium text-gray-500 uppercase dark:text-gray-400">In Progress</div>
                    <div className="text-3xl font-bold text-orange-600">{requests.filter(r => r.status === 'IN_PROGRESS').length}</div>
                </div>
                <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700">
                    <div className="mb-1 text-sm font-medium text-gray-500 uppercase dark:text-gray-400">Completed</div>
                    <div className="text-3xl font-bold text-green-600">{requests.filter(r => r.status === 'COMPLETED').length}</div>
                </div>
            </div>

            <div className="flex mb-6 space-x-4 border-b dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`pb-2 px-1 text-sm font-medium transition-colors ${activeTab === 'requests' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                >
                    Maintenance Requests
                </button>
                <button
                    onClick={() => setActiveTab('technicians')}
                    className={`pb-2 px-1 text-sm font-medium transition-colors ${activeTab === 'technicians' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                >
                    Manage Technicians
                </button>
                <button
                    onClick={() => setActiveTab('analysis')}
                    className={`pb-2 px-1 text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'analysis' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                >
                    <BarChart2 size={16} /> Data Analysis
                </button>
            </div>

            {activeTab === 'requests' && (
                <>
                    <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">All Requests</h2>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                            <input
                                type="text"
                                placeholder="Search by resident, technician, type..."
                                value={requestSearch}
                                onChange={(e) => setRequestSearch(e.target.value)}
                                className="w-full py-2 pl-10 pr-4 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-gray-500 dark:text-gray-400">Loading requests...</div>
                    ) : (
                        <div className="overflow-hidden bg-white rounded-lg shadow dark:bg-gray-800 dark:border dark:border-gray-700">
                            <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
                                <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-200">
                                    <tr>
                                        <th className="px-6 py-3">ID</th>
                                        <th className="px-6 py-3">Resident</th>
                                        <th className="px-6 py-3">Issue</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Assigned Tech</th>
                                        <th className="px-6 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRequests.map(req => (
                                        <tr key={req.request_id} className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 dark:bg-gray-800">
                                            <td className="px-6 py-4 dark:text-white">#{req.request_id}</td>
                                            <td className="px-6 py-4 dark:text-white">{req.resident_name}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium dark:text-white">{req.request_type}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{req.description || 'No description'}</div>
                                            </td>
                                            <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                                            <td className="px-6 py-4">
                                                {req.technician_name ? (
                                                    <span className="flex items-center gap-1 text-green-700 dark:text-green-400">
                                                        <User size={14} /> {req.technician_name}
                                                    </span>
                                                ) : (
                                                    <span className="italic text-gray-400 dark:text-gray-500">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {req.status !== 'COMPLETED' && (
                                                    <select
                                                        className="px-2 py-1 text-xs border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                        onChange={(e) => handleAssign(req.request_id, e.target.value)}
                                                        defaultValue=""
                                                        disabled={!!req.technician_id}
                                                    >
                                                        <option value="" disabled>Assign Tech</option>
                                                        {technicians.map(t => (
                                                            <option key={t.technician_id} value={t.technician_id}>
                                                                {t.name} ({t.specialization || 'General'})
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                                {req.status === 'COMPLETED' && <CheckCircle size={18} className="text-green-500 dark:text-green-400" />}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {activeTab === 'technicians' && (
                <div>
                    <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Technician Fleet</h2>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name or specialization..."
                                value={techSearch}
                                onChange={(e) => setTechSearch(e.target.value)}
                                className="w-full py-2 pl-10 pr-4 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white rounded-lg shadow dark:bg-gray-800 dark:border dark:border-gray-700">
                        <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
                            <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-200">
                                <tr>
                                    <th className="px-6 py-3">Team Member</th>
                                    <th className="px-6 py-3">Specialization</th>
                                    <th className="px-6 py-3">Contact</th>
                                    <th className="px-6 py-3 text-center">Workload Assigned</th>
                                    <th className="px-6 py-3 text-center">Tasks Completed</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTechnicians.map(t => (
                                    <tr key={t.technician_id} className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 dark:bg-gray-800">
                                        <td className="px-6 py-4 font-medium dark:text-white">
                                            <div className="flex items-center gap-2">
                                                <User size={16} className="text-gray-400" />
                                                {t.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 uppercase">{t.specialization || 'General'}</td>
                                        <td className="px-6 py-4">{t.phone_number}</td>
                                        <td className="px-6 py-4 font-bold text-center text-blue-600 dark:text-blue-400">{t.total_assigned || 0}</td>
                                        <td className="px-6 py-4 font-bold text-center text-green-600 dark:text-green-400">{t.total_completed || 0}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${t.status === 'APPROVED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 space-x-2">
                                            {t.status === 'PENDING' && (
                                                <>
                                                    <button onClick={() => handleTechStatus(t.technician_id, 'APPROVED')} className="text-xs font-medium text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">Approve</button>
                                                    <button onClick={() => handleTechStatus(t.technician_id, 'REJECTED')} className="text-xs font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">Reject</button>
                                                </>
                                            )}
                                            {t.status === 'APPROVED' && (
                                                <button onClick={() => handleTechStatus(t.technician_id, 'REJECTED')} className="text-xs font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">Remove</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'analysis' && <AdminAnalysis />}
        </div>
    );
};

export default AdminDashboard;
