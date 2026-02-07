import React from 'react';

const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'in progress':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'pending':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
