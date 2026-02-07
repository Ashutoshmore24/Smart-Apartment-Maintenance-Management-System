import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const TechnicianDashboard = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyTasks = async () => {
        try {
            setLoading(true);
            const res = await api.get('/requests');
            // Filter frontend side for demo simplicity since backend API returns all
            // In prod, pass ID to backend query
            const myTasks = res.data.filter(r => r.technician_id === user.technician_id);
            setRequests(myTasks);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchMyTasks();
    }, [user]);

    const handleComplete = async (id) => {
        if (!window.confirm("Mark this task as completed?")) return;
        try {
            await api.put(`/requests/${id}`, { status: 'Completed' });
            fetchMyTasks();
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Technician Dashboard</h1>
            <p className="text-gray-600 mb-6">Welcome, {user?.name}. Here are your assigned tasks.</p>

            {requests.length === 0 ? (
                <div className="bg-white p-8 rounded-lg text-center text-gray-500 border border-dashed border-gray-300">
                    No tasks assigned to you yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map(req => (
                        <div key={req.request_id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800">{req.request_type}</h3>
                                    <StatusBadge status={req.status} />
                                </div>
                                <p className="text-gray-600 text-sm mb-1">Resident: <strong>{req.resident_name}</strong></p>
                                <p className="text-gray-500 text-sm">{req.description || 'No additional details'}</p>
                            </div>

                            {req.status !== 'Completed' && (
                                <button
                                    onClick={() => handleComplete(req.request_id)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                                >
                                    Mark Complete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TechnicianDashboard;
