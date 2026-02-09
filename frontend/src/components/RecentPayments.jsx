import React from "react";
import { CheckCircle } from "lucide-react";

const RecentPayments = ({ payments }) => {
    if (payments.length === 0) {
        return (
            <div className="p-6 bg-white border rounded-xl">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Payments</h3>
                <p className="text-gray-500">No recent payments found.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border rounded-xl overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-100 text-gray-900 uppercase font-medium">
                        <tr>
                            <th className="px-4 py-3">Req ID</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {payments.map((payment) => (
                            <tr key={payment.payment_id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">
                                    #{payment.request_id}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                        {payment.request_type}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {payment.request_category}
                                </td>
                                <td className="px-4 py-3 font-semibold text-green-600">
                                    ₹{payment.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentPayments;
