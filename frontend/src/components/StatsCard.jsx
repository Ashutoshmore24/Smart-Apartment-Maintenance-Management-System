import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, count, icon: Icon, colorClass, bgColorClass }) => {
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className={`p-6 rounded-[2rem] shadow-xl border border-surface-100 dark:border-surface-800 flex items-center gap-6 glass-card ${bgColorClass}`}
        >
            <div className={`p-4 rounded-2xl ${colorClass} bg-white dark:bg-surface-950 shadow-lg flex items-center justify-center`}>
                <Icon size={28} />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 mb-1">{title}</p>
                <motion.p 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-3xl font-black text-surface-900 dark:text-white"
                >
                    {count}
                </motion.p>
            </div>
        </motion.div>
    );
};

export default StatsCard;
