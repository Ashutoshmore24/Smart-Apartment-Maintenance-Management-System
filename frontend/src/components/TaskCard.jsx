import React, { useState } from 'react';
import { ChevronDown, ChevronUp, User, MapPin, Phone, Mail, Clock, Calendar, CheckCircle2, Zap, AlertTriangle, ShieldAlert, BadgeInfo } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { motion, AnimatePresence } from 'framer-motion';

const PriorityBadge = ({ priority }) => {
    switch (priority) {
        case 'EMERGENCY':
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase tracking-wider text-rose-700 bg-rose-100 rounded-full dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                    <ShieldAlert size={12} strokeWidth={3} /> Emergency
                </span>
            );
        case 'HIGH':
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 rounded-full dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    <AlertTriangle size={12} strokeWidth={3} /> High
                </span>
            );
        default:
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary-700 bg-primary-100 rounded-full dark:bg-primary-900/30 dark:text-primary-400 border border-primary-200 dark:border-primary-800">
                    <Zap size={12} strokeWidth={3} /> Normal
                </span>
            );
    }
};

const TaskCard = ({ task, onComplete }) => {
    const [expanded, setExpanded] = useState(false);
    
    const isEmergency = task.priority === 'EMERGENCY';

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group transition-all duration-500 rounded-[2rem] border overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1
                ${isEmergency 
                    ? 'border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-900/5' 
                    : 'border-surface-100 dark:border-surface-800 bg-white/50 dark:bg-surface-900/40 backdrop-blur-sm hover:bg-white dark:hover:bg-surface-900'}`}
        >
            
            {/* Header (Always Visible) */}
            <div 
                className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex-grow space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-black tracking-tight text-surface-900 dark:text-white uppercase">
                            {task.request_type}
                        </h3>
                        <div className="flex gap-2">
                            <StatusBadge status={task.status} />
                            <PriorityBadge priority={task.priority} />
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center text-sm font-bold text-surface-500 gap-x-6 gap-y-2 dark:text-surface-400">
                        <span className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                <User size={12} className="text-primary-600 dark:text-primary-400" />
                            </div>
                            {task.resident_name || 'System Generated'}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock size={14} className="text-surface-400" /> 
                            {new Date(task.request_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>

                    {!expanded && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm font-medium text-surface-500 line-clamp-1 dark:text-surface-400"
                        >
                            {task.description || 'No description provided.'}
                        </motion.p>
                    )}
                </div>

                <div className="flex items-center justify-between gap-6 sm:flex-row shrink-0">
                    <div className="flex flex-col items-end gap-2">
                        {task.status !== 'COMPLETED' ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => { e.stopPropagation(); onComplete(task.request_id); }}
                                className="px-6 py-3 text-sm font-black text-white transition-all bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 uppercase tracking-wider"
                            >
                                Complete Task
                            </motion.button>
                        ) : (
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-2 px-4 py-2 font-black text-xs uppercase tracking-widest text-emerald-700 bg-emerald-100 rounded-2xl dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                    <CheckCircle2 size={14} strokeWidth={3} /> Done
                                </div>
                                {task.cost > 0 && (
                                    <span className="text-lg font-black text-surface-900 dark:text-white">
                                        ₹{task.cost}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <motion.div 
                        animate={{ rotate: expanded ? 180 : 0 }}
                        className="p-3 text-surface-400 bg-surface-100 dark:bg-surface-800 rounded-2xl group-hover:bg-primary-100 dark:group-hover:bg-primary-900/20 group-hover:text-primary-600 transition-colors"
                    >
                        <ChevronDown size={20} strokeWidth={3} />
                    </motion.div>
                </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {expanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-surface-100 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/40"
                    >
                        <div className="p-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
                            {/* Description block */}
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-2 text-xs font-black text-surface-400 uppercase tracking-[0.2em] ml-2">
                                    <BadgeInfo size={14} /> Description
                                </h4>
                                <div className="p-6 text-base font-medium text-surface-700 leading-relaxed bg-white border border-surface-100 rounded-[2rem] shadow-sm dark:text-surface-200 dark:bg-surface-950/40 dark:border-surface-800">
                                    {task.description || 'No further details provided.'}
                                </div>
                            </div>

                            {/* Contact info block */}
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-2 text-xs font-black text-surface-400 uppercase tracking-[0.2em] ml-2">
                                    Contact & Location
                                </h4>
                                <div className="p-6 space-y-6 bg-white border border-surface-100 rounded-[2rem] shadow-sm dark:bg-surface-950/40 dark:border-surface-800">
                                    <div className="flex items-center gap-4 text-surface-700 dark:text-surface-300">
                                        <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-primary-600">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-surface-400">Flat Identifier</div>
                                            <div className="font-bold">{task.resident_flat_id || 'Global Asset'}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                                        <div className="flex items-center gap-4 text-surface-700 dark:text-surface-300">
                                            <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-emerald-600">
                                                <Phone size={18} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-surface-400">Phone</div>
                                                <div className="font-bold">{task.resident_phone || 'N/A'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-surface-700 dark:text-surface-300">
                                            <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-amber-600">
                                                <Mail size={18} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-surface-400">Email</div>
                                                <div className="font-bold truncate max-w-[120px]">{task.resident_email || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default TaskCard;