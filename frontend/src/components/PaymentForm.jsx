import React, { useState } from 'react';
import api from '../api';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

const PaymentForm = ({ request_id, flat_id, amount: initialAmount, onPaymentSuccess }) => {
    const [billId, setBillId] = useState(request_id || '');
    const [amount, setAmount] = useState(initialAmount || '');
    const [paymentMode, setPaymentMode] = useState('UPI');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Use prop request_id if available, otherwise input billId
        const finalRequestId = request_id || billId;

        if (!finalRequestId) {
            setMessage({ type: 'error', text: 'Bill ID is required.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await api.post('/payments/pay', { // Fixed endpoint path from /payments to /payments/pay
                request_id: finalRequestId,
                flat_id: flat_id,
                payment_mode: paymentMode
            });

            setMessage({ type: 'success', text: 'Payment successful!' });
            setBillId('');
            setAmount('');
            setPaymentMode('UPI');

            if (onPaymentSuccess) {
                onPaymentSuccess();
            }
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.sqlMessage || error.response?.data?.message || 'Payment failed. Please check Bill ID and try again.';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <h2 className="flex items-center gap-2 mb-6 text-xl font-semibold text-gray-800 dark:text-white">
                <CreditCard className="text-blue-600 dark:text-blue-400" />
                New Payment
            </h2>

            {message && (
                <div className={`p-4 mb-4 rounded-md flex items-center gap-2 text-sm ${message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800'
                    : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800'
                    }`}>
                    {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Bill ID</label>
                    <input
                        type="text"
                        value={billId}
                        onChange={(e) => setBillId(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                        placeholder="Enter Bill ID"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                        placeholder="0.00"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Payment Mode</label>
                    <select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                    >
                        <option value="UPI">UPI</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="Net Banking">Net Banking</option>
                        <option value="Cash">Cash</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg dark:bg-blue-600 dark:hover:bg-blue-500'
                        }`}
                >
                    {loading ? 'Processing...' : 'Submit Payment'}
                </button>
            </form>
        </div>
    );
};

export default PaymentForm;
