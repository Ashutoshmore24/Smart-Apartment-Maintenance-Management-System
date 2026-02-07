import React from 'react';
import StatusBadge from './StatusBadge';
import { Package, User, FileText, Activity } from 'lucide-react';

const RequestList = ({ requests, loading }) => {
    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center text-gray-500">
                Loading requests...
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center text-gray-500">
                No maintenance requests found.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 font-semibold">ID</th>
                            <th className="px-6 py-3 font-semibold">Resident</th>
                            <th className="px-6 py-3 font-semibold">Request Type</th>
                            <th className="px-6 py-3 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.request_id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 border-b border-gray-100">
                                    #{request.request_id}
                                </td>
                                <td className="px-6 py-4 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-gray-400" />
                                        {request.resident_name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <FileText size={16} className="text-gray-400" />
                                        {request.request_type}
                                    </div>
                                </td>
                                <td className="px-6 py-4 border-b border-gray-100">
                                    <StatusBadge status={request.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RequestList;
