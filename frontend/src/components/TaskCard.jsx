import React, { useState } from 'react';
import { ChevronDown, ChevronUp, User, MapPin, Phone, Mail, Clock, Calendar, CheckCircle, Zap, AlertTriangle, ShieldAlert } from 'lucide-react';
import StatusBadge from './StatusBadge';

const PriorityBadge = ({ priority }) => {
    switch (priority) {
        case 'EMERGENCY':
            return <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-full dark:bg-red-900/30 dark:text-red-400"><ShieldAlert size={12}/> Emergency</span>;
        case 'HIGH':
            return <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-orange-700 bg-orange-100 rounded-full dark:bg-orange-900/30 dark:text-orange-400"><AlertTriangle size={12}/> High</span>;
        default:
            return <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-400"><Zap size={12}/> Normal</span>;
    }
};

const TaskCard = ({ task, onComplete }) => {
    const [expanded, setExpanded] = useState(false);
    
    const isEmergency = task.priority === 'EMERGENCY';

    return (
        <div className={`transition-all duration-300 border rounded-xl shadow-sm overflow-hidden 
            ${isEmergency ? 'border-red-300 dark:border-red-800/50 bg-red-50/30 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
            
            {/* Header (Always Visible) */}
            <div 
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5`}
                onClick={() => setExpanded(!expanded)}
            >
                <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{task.request_type}</h3>
                        <StatusBadge status={task.status} />
                        <PriorityBadge priority={task.priority} />
                    </div>
                    <div className="flex flex-wrap items-center text-sm text-gray-600 gap-x-4 gap-y-2 dark:text-gray-300">
                        <span className="flex items-center gap-1 font-medium"><User size={14} className="text-blue-500" /> {task.resident_name || 'System Generated'}</span>
                        <span className="flex items-center gap-1"><Clock size={14} className="text-gray-400" /> {new Date(task.request_date).toLocaleDateString()}</span>
                    </div>
                    {!expanded && (
                        <p className="mt-2 text-sm text-gray-500 line-clamp-1 dark:text-gray-400">
                            {task.description || 'No description provided.'}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end shrink-0">
                    <button className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors bg-white dark:bg-gray-700 rounded-full shadow-sm">
                        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    {task.status !== 'COMPLETED' ? (
                        <button
                            onClick={(e) => { e.stopPropagation(); onComplete(task.request_id); }}
                            className="px-4 py-2 text-sm font-bold text-white transition-colors bg-green-600 rounded-lg shadow-sm hover:bg-green-700"
                        >
                            Complete Task
                        </button>
                    ) : (
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1 px-3 py-1 font-bold text-green-700 bg-green-100 rounded-full dark:bg-green-900/30 dark:text-green-400">
                                <CheckCircle size={14} /> Done
                            </div>
                            {task.cost > 0 && (
                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                    ₹{task.cost} Bill
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Expanded Content */}
            {expanded && (
                <div className="p-4 border-t border-gray-100 sm:p-5 bg-gray-50 dark:bg-gray-800/80 dark:border-gray-700">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Description block */}
                        <div>
                            <h4 className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 uppercase dark:text-gray-300">
                                <Calendar size={14} /> Issue Detail
                            </h4>
                            <p className="p-3 text-sm text-gray-700 whitespace-pre-wrap bg-white border border-gray-200 rounded-lg shadow-inner dark:text-gray-200 dark:bg-gray-900 dark:border-gray-700">
                                {task.description || 'No further details provided.'}
                            </p>
                        </div>

                        {/* Contact info block */}
                        <div>
                            <h4 className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 uppercase dark:text-gray-300">
                                Resident Info
                            </h4>
                            <div className="p-3 space-y-3 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-900 dark:border-gray-700">
                                <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                                    <MapPin size={16} className="text-gray-400 shrink-0" /> 
                                    <span>Flat ID: <strong>{task.resident_flat_id || 'N/A'}</strong></span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                                    <Phone size={16} className="text-gray-400 shrink-0" /> 
                                    <span>{task.resident_phone || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                                    <Mail size={16} className="text-gray-400 shrink-0" /> 
                                    <span className="truncate">{task.resident_email || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskCard;