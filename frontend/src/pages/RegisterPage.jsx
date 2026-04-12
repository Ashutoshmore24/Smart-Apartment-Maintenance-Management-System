/* Everything Ready */
import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [role, setRole] = useState('resident'); // 'resident' or 'technician'

    // Resident Data
    const [residentData, setResidentData] = useState({
        name: '',
        phone_number: '',
        email: '',
        flat_id: ''
    });

    // Technician Data
    const [techData, setTechData] = useState({
        name: '',
        phone_number: '',
        specialization: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleResidentChange = (e) => {
        setResidentData({ ...residentData, [e.target.name]: e.target.value });
    };

    const handleTechChange = (e) => {
        setTechData({ ...techData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (role === 'resident') {
                const res = await api.post('/users/register', residentData);
                alert(`Registration Successful! Your Resident ID is: ${res.data.resident_id}. Please remember this for login.`);
                navigate('/login');
            } else {
                const res = await api.post('/users/register/technician', techData);
                alert(`Registration Successful! ${res.data.message} Your Technician ID is: ${res.data.technician_id}.`);
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border dark:border-gray-700">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800 dark:text-white">Create Account</h2>

                <div className="flex justify-center gap-4 mb-6">
                    <button
                        type="button"
                        onClick={() => setRole('resident')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${role === 'resident' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                    >
                        Resident
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('technician')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${role === 'technician' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                    >
                        Technician
                    </button>
                </div>

                {error && <p className="mb-4 text-sm text-center text-red-500">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Common Fields */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={role === 'resident' ? residentData.name : techData.name}
                            onChange={role === 'resident' ? handleResidentChange : handleTechChange}
                            required
                            className="w-full p-2 mt-1 border rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                        <input
                            type="text"
                            name="phone_number"
                            placeholder="Phone Number"
                            value={role === 'resident' ? residentData.phone_number : techData.phone_number}
                            onChange={role === 'resident' ? handleResidentChange : handleTechChange}
                            required
                            className="w-full p-2 mt-1 border rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                        />
                    </div>

                    {/* Resident Specific */}
                    {role === 'resident' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={residentData.email}
                                    onChange={handleResidentChange}
                                    className="w-full p-2 mt-1 border rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Flat ID</label>
                                <input
                                    type="number"
                                    name="flat_id"
                                    placeholder="Flat ID (e.g., 1)"
                                    value={residentData.flat_id}
                                    onChange={handleResidentChange}
                                    required
                                    className="w-full p-2 mt-1 border rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                                />
                            </div>
                        </>
                    )}

                    {/* Technician Specific */}
                    {role === 'technician' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Specialization</label>
                            <input
                                type="text"
                                name="specialization"
                                placeholder="e.g. Plumbing, Electrical, Cleaning"
                                value={techData.specialization}
                                onChange={handleTechChange}
                                required
                                className="w-full p-2 mt-1 border rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600"
                    >
                        Register as {role === 'resident' ? 'Resident' : 'Technician'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link to="/login" className="text-sm text-blue-600 hover:underline dark:text-blue-400">Already have an account? Login</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;