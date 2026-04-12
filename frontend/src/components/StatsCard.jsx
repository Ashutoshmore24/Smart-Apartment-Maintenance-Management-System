/* Everything Ready */
import React from 'react';

const StatsCard = ({ title, count, icon: Icon, colorClass, bgColorClass }) => {
    return (
        <div className={`p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 ${bgColorClass}`}>
            <div className={`p-3 rounded-lg ${colorClass} bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
            </div>
        </div>
    );
};

export default StatsCard;
