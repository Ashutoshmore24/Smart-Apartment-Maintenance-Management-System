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
    };

    return (
        <div className="max-w-6xl px-6 py-12 mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Maintenance Payments
                </h1>
                <p className="text-gray-600 mt-2">
                    Manage your maintenance bills and view payment history
                </p>
            </div>

            <div className="grid items-start grid-cols-1 gap-8 lg:grid-cols-3">

                {/* Left Column: Pending Bills */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        Pending Bills
                    </h2>

                    {bills.length === 0 && (
                        <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">
                                No pending maintenance payments 🎉
                            </p>
                        </div>
                    )}

                    {bills.map((bill) => (
                        <div
                            key={bill.request_id}
                            className="p-6 bg-white border rounded-xl shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        Request ID: #{bill.request_id}
                                    </p>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {bill.request_type}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {bill.description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-900">
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
                    <div className="p-6 border border-blue-100 bg-blue-50 rounded-xl">
                        <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-blue-900">
                            <History size={20} />
                            Payment Information
                        </h3>

                        <ul className="space-y-3 text-sm text-blue-800">
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
