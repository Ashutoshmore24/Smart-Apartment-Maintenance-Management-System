import React from 'react';
import { CheckCircle, Clock, AlertTriangle, HelpCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const getConfig = (status) => {
        switch (status?.toUpperCase()) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800';
            case 'IN_PROGRESS':
                return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-800';
            case 'PENDING':
                return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
        }
    };

    const classes = getConfig(status);

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${classes}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
