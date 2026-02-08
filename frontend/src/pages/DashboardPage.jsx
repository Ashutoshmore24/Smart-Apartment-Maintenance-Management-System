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
    const [newRequest, setNewRequest] = useState({
        type: 'Plumbing',
        description: '',
        category: 'FLAT',
        asset_id: null
      });
      
      const [assets, setAssets] = useState([]);

      const fetchAssets = async () => {
        try {
          const res = await api.get('/assets');
          setAssets(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      

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
        fetchAssets();
      }, [user]);
      

      const handleSubmitRequest = async (e) => {
        e.preventDefault();
        try {
            await api.post('/requests', {
                resident_id: user.resident_id,
                request_type: newRequest.type,
                description: newRequest.description,
                request_category: newRequest.category,   // FLAT or ASSET
                asset_id: newRequest.category === 'ASSET' 
                    ? newRequest.asset_id 
                    : null
            });
    
            setShowModal(false);
            fetchRequests();
    
            // Reset form
            setNewRequest({
                type: 'Plumbing',
                description: '',
                category: 'FLAT',
                asset_id: null
            });
    
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
        <div className="px-6 py-8 mx-auto max-w-7xl">
            <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Resident Dashboard</h1>
                    <p className="text-gray-600">Welcome, {user.name}. Track your requests.</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700"
                    >
                        <Plus size={16} />
                        New Request
                    </button>
                    <button
                        onClick={fetchRequests}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
                    <div className="mb-1 text-sm font-medium text-gray-500 uppercase">Total Requests</div>
                    <div className="text-3xl font-bold text-gray-900">{requests.length}</div>
                </div>
                <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
                    <div className="mb-1 text-sm font-medium text-gray-500 uppercase">Pending Actions</div>
                    <div className="text-3xl font-bold text-orange-600">
                        {requests.filter(r => r.status === 'Pending').length}
                    </div>
                </div>
                <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
                    <div className="mb-1 text-sm font-medium text-gray-500 uppercase">Resolved</div>
                    <div className="text-3xl font-bold text-green-600">
                        {requests.filter(r => r.status === 'Completed').length}
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-4 px-6 py-4 bg-white border-b border-gray-200 rounded-t-lg">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md p-6 bg-white rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">New Maintenance Request</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmitRequest} className="space-y-4">
                            <div>
                            <div>
  <label className="block mb-1 text-sm font-medium">
    Request Level
  </label>
  <select
    className="w-full px-3 py-2 border rounded"
    value={newRequest.category}
    onChange={(e) =>
      setNewRequest({
        ...newRequest,
        category: e.target.value,
        asset_id: null
      })
    }
  >
    <option value="FLAT">Flat Level</option>
    <option value="ASSET">Asset Level</option>
  </select>
</div>

{newRequest.category === 'ASSET' && (
  <div>
    <label className="block mb-1 text-sm font-medium">
      Select Asset
    </label>
    <select
      className="w-full px-3 py-2 border rounded"
      value={newRequest.asset_id || ''}
      onChange={(e) =>
        setNewRequest({ ...newRequest, asset_id: e.target.value })
      }
      required
    >
      <option value="">-- Select Asset --</option>
      {assets.map(asset => (
        <option key={asset.asset_id} value={asset.asset_id}>
          {asset.asset_name}
        </option>
      ))}
    </select>
  </div>
)}

                                
                                <label className="block mb-1 text-sm font-medium">Request Type</label>
                                <select
                                    className="w-full px-3 py-2 border rounded"
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
                                <label className="block mb-1 text-sm font-medium">Description (Optional)</label>
                                <textarea
                                    className="w-full px-3 py-2 border rounded"
                                    rows="3"
                                    value={newRequest.description}
                                    onChange={e => setNewRequest({ ...newRequest, description: e.target.value })}
                                    placeholder="Describe the issue..."
                                ></textarea>
                            </div>
                            <button type="submit" className="w-full py-2 font-medium text-white bg-blue-600 rounded hover:bg-blue-700">Submit Request</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
