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
                status: 'IN_PROGRESS',
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
        <div className="px-6 py-8 mx-auto max-w-7xl">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Admin Dashboard</h1>

            <div className="overflow-hidden bg-white rounded-lg shadow">
                <table className="w-full text-sm text-left">
                    <thead className="text-gray-700 uppercase bg-gray-50">
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
                                        <span className="italic text-gray-400">Unassigned</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {req.status !== 'COMPLETED' && (
                                        <select
                                            className="px-2 py-1 text-xs border rounded"
                                            onChange={(e) => handleAssign(req.request_id, e.target.value)}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Assign Tech</option>
                                            {technicians.map(t => (
                                                <option key={t.technician_id} value={t.technician_id}>
                                                    {t.name} ({t.specialization || 'General'})
                                                </option>
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
