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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
                <CreditCard className="text-blue-600" />
                New Payment
            </h2>

            {message && (
                <div className={`p-4 mb-4 rounded-md flex items-center gap-2 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bill ID</label>
                    <input
                        type="text"
                        value={billId}
                        onChange={(e) => setBillId(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Enter Bill ID"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="0.00"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                    <select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                    className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                        }`}
                >
                    {loading ? 'Processing...' : 'Submit Payment'}
                </button>
            </form>
        </div>
    );
};

export default PaymentForm;
