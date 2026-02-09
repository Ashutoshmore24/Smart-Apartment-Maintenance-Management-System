import React, { useState } from 'react';
import { loginResident, loginTechnician } from '../api'; // We might need new API methods for Tech/Admin
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        id: '', // Changed to generic ID
        role: 'resident' // Default role
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Use context

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            let user = null;
            let role = formData.role;

            if (role === 'resident') {
                const res = await loginResident({ name: formData.name, resident_id: formData.id });
                user = res.data.user;
                // Ensure resident_id is present for dashboard logic
                user.resident_id = parseInt(user.resident_id || formData.id, 10);
            } else if (role === 'admin') {
                // TEMP: Hardcoded Admin for now as per "simple DB-based" request usually implies basic auth
                // Or I should check if there is an admin table. 
                // Schema doesn't show Admin table. Usually Admin is a special user or just hardcoded in academic projects.
                if (formData.name === 'admin' && formData.id === 'admin123') {
                    user = { name: 'Admin', role: 'admin' };
                } else {
                    throw new Error('Invalid Admin Credentials');
                }
            } else if (role === 'technician') {
                const res = await loginTechnician({ name: formData.name, technician_id: formData.id });
                user = res.data.user;
                user.role = 'technician';
            }


            if (user) {
                login(user, role);
                if (role === 'resident') navigate('/dashboard');
                if (role === 'admin') navigate('/admin-dashboard');
                if (role === 'technician') navigate('/technician-dashboard');
            }

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Login</h2>
                {error && <p className="mb-4 text-sm text-center text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="resident">Resident</option>
                            <option value="technician">Technician</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {formData.role === 'admin' ? 'Username' : 'Name'}
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder={formData.role === 'admin' ? 'admin' : 'Full Name'}
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-2 mt-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {formData.role === 'admin' ? 'Password' : (formData.role === 'technician' ? 'Technician ID' : 'Resident ID')}
                        </label>
                        <input
                            type={formData.role === 'admin' ? 'password' : 'text'}
                            name="id"
                            placeholder={formData.role === 'admin' ? 'admin123' : 'ID'}
                            value={formData.id}
                            onChange={handleChange}
                            required
                            className="w-full p-2 mt-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    {formData.role === 'resident' && (
                        <Link to="/register" className="text-sm text-blue-600 hover:underline">Need an account? Register</Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
