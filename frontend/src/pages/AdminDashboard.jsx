import React, { useEffect, useState } from 'react';
import api from '../api';
import StatusBadge from '../components/StatusBadge';
import { User, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [reqRes, techRes] = await Promise.all([
                api.get('/requests'),
                api.get('/users/technicians')
            ]);
            setRequests(reqRes.data);
            setTechnicians(techRes.data);
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
                status: 'In Progress',
                technician_id: technicianId
            });
            fetchData(); // Refresh to show update
            alert('Technician assigned successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to assign technician');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 uppercase">
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
                        {requests.map(req => (
                            <tr key={req.request_id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4">#{req.request_id}</td>
                                <td className="px-6 py-4">{req.resident_name}</td>
                                <td className="px-6 py-4">
                                    <div className="font-medium">{req.request_type}</div>
                                    <div className="text-xs text-gray-500">{req.description || 'No description'}</div>
                                </td>
                                <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                                <td className="px-6 py-4">
                                    {req.technician_name ? (
                                        <span className="flex items-center gap-1 text-green-700">
                                            <User size={14} /> {req.technician_name}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 italic">Unassigned</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {req.status !== 'Completed' && (
                                        <select
                                            className="border rounded px-2 py-1 text-xs"
                                            onChange={(e) => handleAssign(req.request_id, e.target.value)}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Assign Tech</option>
                                            {technicians.map(t => (
                                                <option key={t.technician_id} value={t.technician_id}>{t.name}</option>
                                            ))}
                                        </select>
                                    )}
                                    {req.status === 'Completed' && <CheckCircle size={18} className="text-green-500" />}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
