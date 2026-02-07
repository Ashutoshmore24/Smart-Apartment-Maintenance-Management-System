import React from 'react';
import PaymentForm from '../components/PaymentForm';
import { CreditCard, History } from 'lucide-react';

const PaymentPage = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Maintenance Payments</h1>
                <p className="text-gray-600">Securely pay your monthly maintenance bills</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Payment Form Section */}
                <div>
                    <PaymentForm />
                </div>

                {/* Info / History Placeholder */}
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                        <History size={20} />
                        Payment Information
                    </h3>
                    <ul className="space-y-4 text-blue-800 text-sm">
                        <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></div>
                            <span>Ensure you enter the correct <strong>Bill ID</strong> from your physical invoice.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></div>
                            <span>Payments are processed securely via our banking partners.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></div>
                            <span>Receipts are automatically generated and sent to your registered email.</span>
                        </li>
                    </ul>

                    <div className="mt-8 pt-6 border-t border-blue-100">
                        <p className="text-xs text-blue-600 uppercase font-bold tracking-wider mb-2">Accepted Methods</p>
                        <div className="flex gap-3 opcity-70">
                            <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-xs font-bold text-gray-400 border">VISA</div>
                            <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-xs font-bold text-gray-400 border">MC</div>
                            <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-xs font-bold text-gray-400 border">UPI</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
