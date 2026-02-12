import React from 'react';
import StatusBadge from './StatusBadge';
import { Package, User, FileText, Activity } from 'lucide-react';

const RequestList = ({ requests, loading }) => {
    if (loading) {
        return (
            <div className="p-6 text-center text-gray-500 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                Loading requests...
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="p-6 text-center text-gray-500 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                No maintenance requests found.
            </div>
        );
    }

    return (
        <div className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
                    <thead className="text-xs text-gray-700 uppercase border-b border-gray-100 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">


                        <tr>
                            <th className="px-6 py-3 font-semibold">ID</th>
                            <th className="px-6 py-3 font-semibold">Resident</th>
                            <th className="px-6 py-3 font-semibold">Request Type</th>
                            <th className="px-6 py-3 font-semibold">Category</th>
                            <th className="px-6 py-3 font-semibold">Related To</th>
                            <th className="px-6 py-3 font-semibold">Status</th>
                        </tr>


                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.request_id} className="transition-colors bg-white border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 font-medium text-gray-900 border-b border-gray-100 dark:text-white dark:border-gray-700">
                                    #{request.request_id}
                                </td>
                                <td className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-gray-400 dark:text-gray-500" />
                                        {request.resident_name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-2">
                                        <FileText size={16} className="text-gray-400 dark:text-gray-500" />
                                        {request.request_type}
                                    </div>
                                </td>
                                <td className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${request.request_category === "ASSET"
                                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200"
                                                : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                            }`}
                                    >
                                        {request.request_category}
                                    </span>
                                </td>

                                <td className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-2">
                                        <Package size={16} className="text-gray-400 dark:text-gray-500" />
                                        {request.request_category === "ASSET"
                                            ? request.asset_name
                                            : `Flat ${request.flat_number}`}
                                    </div>
                                </td>

                                <td className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
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
