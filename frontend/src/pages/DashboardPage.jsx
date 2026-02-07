import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import RequestList from '../components/RequestList';
import { Filter, RefreshCw, Plus, X } from 'lucide-react';

const DashboardPage = () => {
    const { user, role } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [newRequest, setNewRequest] = useState({ type: 'Plumbing', description: '' });

    const fetchRequests = () => {
        setLoading(true);
        api.get("/requests")
            .then(res => {
                // Filter resident's requests only
                if (role === 'resident' && user) {
                    const myRequests = res.data.filter(r => r.resident_id === user.resident_id);
                    setRequests(myRequests);
                } else {
                    // Fallback for demo or admin viewing this page
                    setRequests(res.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchRequests();
    }, [user]);

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        try {
            await api.post('/requests', {
                resident_id: user.resident_id,
                request_type: newRequest.type,
                description: newRequest.description
            });
            setShowModal(false);
            fetchRequests();
            setNewRequest({ type: 'Plumbing', description: '' });
            alert('Request submitted successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to submit request');
        }
    };

    const filteredRequests = filter === 'All'
        ? requests
        : requests.filter(r => r.status === filter);

    if (!user) return <div className="p-10 text-center">Please login first.</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Resident Dashboard</h1>
                    <p className="text-gray-600">Welcome, {user.name}. Track your requests.</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
                    >
                        <Plus size={16} />
                        New Request
                    </button>
                    <button
                        onClick={fetchRequests}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium uppercase mb-1">Total Requests</div>
                    <div className="text-3xl font-bold text-gray-900">{requests.length}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium uppercase mb-1">Pending Actions</div>
                    <div className="text-3xl font-bold text-orange-600">
                        {requests.filter(r => r.status === 'Pending').length}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium uppercase mb-1">Resolved</div>
                    <div className="text-3xl font-bold text-green-600">
                        {requests.filter(r => r.status === 'Completed').length}
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-t-lg border-b border-gray-200 px-6 py-4 flex items-center gap-4">
                <Filter size={18} className="text-gray-400" />
                {['All', 'Pending', 'In Progress', 'Completed'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === status
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <RequestList requests={filteredRequests} loading={loading} />

            {/* New Request Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">New Maintenance Request</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmitRequest} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Request Type</label>
                                <select
                                    className="w-full border rounded px-3 py-2"
                                    value={newRequest.type}
                                    onChange={e => setNewRequest({ ...newRequest, type: e.target.value })}
                                >
                                    <option value="Plumbing">Plumbing</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="Carpentry">Carpentry</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                                <textarea
                                    className="w-full border rounded px-3 py-2"
                                    rows="3"
                                    value={newRequest.description}
                                    onChange={e => setNewRequest({ ...newRequest, description: e.target.value })}
                                    placeholder="Describe the issue..."
                                ></textarea>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700">Submit Request</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
