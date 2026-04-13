import React from 'react';
import { CheckCircle2, Clock, Hourglass, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const StatusBadge = ({ status }) => {
    const getConfig = (status) => {
        switch (status?.toUpperCase()) {
            case 'COMPLETED':
                return {
                    styles: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
                    icon: CheckCircle2,
                    label: 'Completed'
                };
            case 'IN_PROGRESS':
                return {
                    styles: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
                    icon: Clock,
                    label: 'In Progress'
                };
            case 'PENDING':
                return {
                    styles: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400',
                    icon: Hourglass,
                    label: 'Pending'
                };
            default:
                return {
                    styles: 'bg-surface-500/10 text-surface-600 border-surface-500/20 dark:text-surface-400',
                    icon: HelpCircle,
                    label: status || 'Unknown'
                };
        }
    };

    const config = getConfig(status);
    const Icon = config.icon;

    return (
        <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${config.styles}`}
        >
            <Icon size={12} strokeWidth={3} />
            {config.label}
        </motion.span>
    );
};

export default StatusBadge;
