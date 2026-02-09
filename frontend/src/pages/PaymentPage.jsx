import React, { useEffect, useState } from "react";
import PaymentForm from "../components/PaymentForm";
import { History } from "lucide-react";
import { getPendingBills } from "../api";
import { useAuth } from "../context/AuthContext";

const PaymentPage = () => {
    const { user } = useAuth();
    const [bills, setBills] = useState([]);

    useEffect(() => {
        const fetchBills = async () => {
            if (user?.resident_id) {
                try {
                    const res = await getPendingBills(user.resident_id);
                    setBills(res.data);
                } catch (e) {
                    console.error(e);
                }
            }
        };
        fetchBills();
    }, [user]);

    return (
        <div className="max-w-4xl px-6 py-12 mx-auto">
            <div className="mb-12 text-center">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                    Maintenance Payments
                </h1>
                <p className="text-gray-600">
                    Pay pending maintenance request charges
                </p>
            </div>

            <div className="grid items-start grid-cols-1 gap-8 md:grid-cols-2">

                {/* Pending Bills */}
                <div className="space-y-6">
                    {bills.length === 0 && (
                        <p className="text-gray-500">
                            No pending maintenance payments 🎉
                        </p>
                    )}

                    {bills.map((bill) => (
                        <div
                            key={bill.request_id}
                            className="p-4 bg-white border rounded-xl"
                        >
                            <p className="text-sm text-gray-600">
                                <b>Request ID:</b> {bill.request_id}
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                                Amount: ₹{bill.amount}
                            </p>
                            <p className="text-sm text-gray-500">
                                {bill.request_type} - {bill.description}
                            </p>

                            <PaymentForm
                                request_id={bill.request_id}
                                flat_id={bill.flat_id}
                            />
                        </div>
                    ))}
                </div>

                {/* Info Section */}
                <div className="p-6 border border-blue-100 bg-blue-50 rounded-xl">
                    <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-blue-900">
                        <History size={20} />
                        Payment Information
                    </h3>

                    <ul className="space-y-4 text-sm text-blue-800">
                        <li>• Payments are generated only after request completion</li>
                        <li>• Each maintenance request has a unique Request ID</li>
                        <li>• Only pending requests can be paid</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
