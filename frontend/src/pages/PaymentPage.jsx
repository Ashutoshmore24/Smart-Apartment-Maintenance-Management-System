import React, { useEffect, useState, useCallback } from "react";
import PaymentForm from "../components/PaymentForm";
import RecentPayments from "../components/RecentPayments";
import { History } from "lucide-react";
import { getPendingBills, getPaymentHistory } from "../api";
import { useAuth } from "../context/AuthContext";

const PaymentPage = () => {
    const { user } = useAuth();
    const [bills, setBills] = useState([]);
    const [paymentHistory, setPaymentHistory] = useState([]);

    const fetchData = useCallback(async () => {
        if (user?.resident_id) {
            try {
                const [billsRes, historyRes] = await Promise.all([
                    getPendingBills(user.resident_id),
                    getPaymentHistory(user.resident_id)
                ]);
                setBills(billsRes.data);
                setPaymentHistory(historyRes.data);
            } catch (e) {
                console.error(e);
            }
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePaymentSuccess = () => {
        fetchData();

        window.dispatchEvent(new Event("payment-updated"));
    };

    return (
        <div className="max-w-6xl px-6 py-12 mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Maintenance Payments
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Manage your maintenance bills and view payment history
                </p>
            </div>

            <div className="grid items-start grid-cols-1 gap-8 lg:grid-cols-3">

                {/* Left Column: Pending Bills */}
                <div className="space-y-6 lg:col-span-2">
                    <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800 dark:text-white">
                        Pending Bills
                    </h2>

                    {bills.length === 0 && (
                        <div className="p-8 text-center border border-gray-300 border-dashed bg-gray-50 rounded-xl">
                            <p className="text-gray-500">
                                No pending maintenance payments 🎉
                            </p>
                        </div>
                    )}

                    {bills.map((bill) => (
                        <div
                            key={bill.request_id}
                            className="p-6 bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                        Request ID: #{bill.request_id}
                                    </p>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        {bill.request_type}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {bill.description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        ₹{bill.amount}
                                    </p>
                                </div>
                            </div>

                            <PaymentForm
                                request_id={bill.request_id}
                                flat_id={bill.flat_id}
                                onPaymentSuccess={handlePaymentSuccess}
                            />
                        </div>
                    ))}
                </div>

                {/* Right Column: Recent Payments & Info */}
                <div className="space-y-8">

                    <RecentPayments payments={paymentHistory} />

                    {/* Info Section */}
                    <div className="p-6 border border-blue-100 bg-blue-50 rounded-xl dark:bg-gray-800 dark:border-gray-700">
                        <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-blue-900 dark:text-blue-400">
                            <History size={20} />
                            Payment Information
                        </h3>

                        <ul className="space-y-3 text-sm text-blue-800 dark:text-blue-300">
                            <li className="flex gap-2">
                                <span>•</span> Payments are generated only after request completion
                            </li>
                            <li className="flex gap-2">
                                <span>•</span> Each maintenance request has a unique Request ID
                            </li>
                            <li className="flex gap-2">
                                <span>•</span> Only pending requests can be paid
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
