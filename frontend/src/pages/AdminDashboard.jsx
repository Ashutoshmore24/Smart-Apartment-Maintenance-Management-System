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
    const handleAutoAssign = async () => {
        try {
          const res = await api.post("/requests/auto-assign");
          alert(res.data.message);
            fetchData(); // refresh dashboard
            alert('All the Technicians assigned successfully!');
        } catch (error) {
          console.error(error);
          alert("Auto assignment failed");
        }
    };
    
    const hasUnassigned = requests.some(
        r => !r.technician_id && r.status === 'PENDING'
      );
      
      

    return (
        <div className="px-6 py-8 mx-auto max-w-7xl">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center justify-between mb-6">
  <h1 className="text-2xl font-bold text-gray-900">All Requests</h1>

  <button
  onClick={handleAutoAssign}
  disabled={!hasUnassigned}
  className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors
    ${hasUnassigned ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'}
  `}
>
  Auto Assign Technician
</button>

</div>



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
                                    {req.status === 'COMPLETED' && <CheckCircle size={18} className="text-green-500" />}
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
