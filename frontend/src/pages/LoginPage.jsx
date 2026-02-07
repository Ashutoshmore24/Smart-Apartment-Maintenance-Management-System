import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { User, Shield, Wrench, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const [activeTab, setActiveTab] = useState('resident');
    const [residents, setResidents] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [adminPass, setAdminPass] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/users/residents').then(res => setResidents(res.data)).catch(console.error);
        api.get('/users/technicians').then(res => setTechnicians(res.data)).catch(console.error);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        if (activeTab === 'admin') {
            if (adminPass === 'admin') {
                login({ name: 'Administrator', role: 'admin' }, 'admin');
                navigate('/admin-dashboard');
            } else {
                setError('Invalid Password');
            }
        } else if (activeTab === 'resident') {
            const user = residents.find(r => r.resident_id == selectedUser);
            if (user) {
                login(user, 'resident');
                navigate('/dashboard');
            } else {
                setError('Please select a resident');
            }
        } else if (activeTab === 'technician') {
            const user = technicians.find(t => t.technician_id == selectedUser);
            if (user) {
                login(user, 'technician');
                navigate('/technician-dashboard');
            } else {
                setError('Please select a technician');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 p-8 text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-blue-100">Smart Apartment Maintenance</p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    {[
                        { id: 'resident', label: 'Resident', icon: User },
                        { id: 'technician', label: 'Technician', icon: Wrench },
                        { id: 'admin', label: 'Admin', icon: Shield }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setSelectedUser(''); setError(''); }}
                            className={`flex-1 py-4 text-sm font-medium flex flex-col items-center gap-1 transition-colors ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Form */}
                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {activeTab === 'resident' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Name</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={selectedUser}
                                    onChange={e => setSelectedUser(e.target.value)}
                                >
                                    <option value="">-- Select Resident --</option>
                                    {residents.map(r => (
                                        <option key={r.resident_id} value={r.resident_id}>{r.name} (Flat {r.flat_id})</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {activeTab === 'technician' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Name</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={selectedUser}
                                    onChange={e => setSelectedUser(e.target.value)}
                                >
                                    <option value="">-- Select Technician --</option>
                                    {technicians.map(t => (
                                        <option key={t.technician_id} value={t.technician_id}>{t.name} ({t.specialization})</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {activeTab === 'admin' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter password (admin)"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={adminPass}
                                    onChange={e => setAdminPass(e.target.value)}
                                />
                            </div>
                        )}

                        {error && <div className="text-red-500 text-sm">{error}</div>}

                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            Login as {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                            <ArrowRight size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
