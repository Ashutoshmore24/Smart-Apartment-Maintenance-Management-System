import React from "react";
import { CheckCircle } from "lucide-react";

const RecentPayments = ({ payments }) => {
    if (payments.length === 0) {
        return (
            <div className="p-6 bg-white border rounded-xl dark:bg-gray-800 dark:border-gray-700">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Payments</h3>
                <p className="text-gray-500 dark:text-gray-400">No recent payments found.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden bg-white border rounded-xl dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 border-b bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Payments</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
                    <thead className="font-medium text-gray-900 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                        <tr>
                            <th className="px-4 py-3">Req ID</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-600">
                        {payments.map((payment) => (
                            <tr key={payment.payment_id} className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800">
                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                    #{payment.request_id}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 rounded-full bg-blue-50 dark:bg-blue-900 dark:text-blue-200">
                                        {payment.request_type}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {payment.request_category}
                                </td>
                                <td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">
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
