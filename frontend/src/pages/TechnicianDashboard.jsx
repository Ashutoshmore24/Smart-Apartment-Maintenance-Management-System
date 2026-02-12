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
        const cost = prompt("Enter maintenance cost:");
        if (!cost || isNaN(cost) || cost <= 0) {
            alert("Valid cost is required");
            return;
        }

        if (!window.confirm("Mark this task as completed?")) return;

        try {
            await api.put(`/requests/complete/${id}`, { cost });
            fetchMyTasks();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to complete request");
        }
    };


    return (
        <div className="max-w-4xl px-6 py-8 mx-auto">
            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Technician Dashboard</h1>
            <p className="mb-6 text-gray-600 dark:text-gray-300">Welcome, {user?.name}. Here are your assigned tasks.</p>

            {requests.length === 0 ? (
                <div className="p-8 text-center text-gray-500 bg-white border border-gray-300 border-dashed rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                    No tasks assigned to you yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map(req => (
                        <div key={req.request_id} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:shadow-md">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{req.request_type}</h3>
                                    <StatusBadge status={req.status} />
                                </div>
                                <p className="mb-1 text-sm text-gray-600 dark:text-gray-300">Resident: <strong className="dark:text-white">{req.resident_name}</strong></p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{req.description || 'No additional details'}</p>
                            </div>

                            {req.status !== 'COMPLETED' && (
                                <button
                                    onClick={() => handleComplete(req.request_id)}
                                    className="px-4 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
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
