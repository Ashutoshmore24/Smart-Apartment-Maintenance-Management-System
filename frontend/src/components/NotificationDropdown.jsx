import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markNotificationAsRead } from '../api';

const NotificationDropdown = () => {
    const { user, role } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Only fetch for resident or technician for now
    const validRole = role === 'resident' || role === 'technician';

    const fetchNotifications = async () => {
        if (!user || !validRole) return;

        // Determine correct ID based on role
        const userId = role === 'resident' ? user.resident_id : user.technician_id;
        if (!userId) return;

        try {
            const res = await getNotifications(role.toUpperCase(), userId);
            setNotifications(res.data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Poll every 10 seconds
        const intervalId = setInterval(fetchNotifications, 10000);

        return () => clearInterval(intervalId);
    }, [user, role]);

    // Handle clicks outside dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleRead = async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId);
            setNotifications(prev => prev.map(n =>
                n.id === notificationId ? { ...n, is_read: 1 } : n
            ));
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    if (!user || !validRole) return null;

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 transition bg-blue-500 rounded-full hover:bg-blue-400 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none"
            >
                <Bell size={18} className="text-white" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 w-80 mt-2 bg-white rounded-lg shadow-xl dark:bg-gray-800 z-50 border border-gray-100 dark:border-gray-700 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Notifications</h3>
                    </div>

                    {notifications.length === 0 ? (
                        <div className="p-4 text-sm text-center text-gray-500 dark:text-gray-400">
                            No notifications yet
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`p-3 transition-colors duration-150 cursor-pointer flex justify-between items-start gap-3
                                        ${!notif.is_read ? 'bg-blue-50 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                                    onClick={() => !notif.is_read && handleRead(notif.id)}
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm ${!notif.is_read ? 'font-medium text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>
                                            {notif.message}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(notif.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    {!notif.is_read && (
                                        <div className="flex-shrink-0 mt-0.5" title="Mark as read">
                                            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full dark:bg-blue-400"></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
