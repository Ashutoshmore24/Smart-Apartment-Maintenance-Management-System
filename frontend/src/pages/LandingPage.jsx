import React from 'react';
import { Link } from 'react-router-dom';
import { Building, ShieldCheck, Wrench, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
            {/* Hero Section */}
            <div className="flex-grow flex items-center justify-center px-6">
                <div className="max-w-4xl w-full text-center space-y-8">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                        <Building className="text-blue-600 w-8 h-8" />
                    </div>

                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl">
                        Smart Apartment <br />
                        <span className="text-blue-600">Maintenance System</span>
                    </h1>

                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Streamline your apartment living experience. Report issues, track maintenance requests, and pay bills all in one place.
                    </p>

                    <div className="flex justify-center gap-4 pt-4">
                        <Link
                            to="/dashboard"
                            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg shadow-lg hover:bg-blue-700 transition-all transform hover:-translate-y-1 flex items-center gap-2"
                        >
                            Resident Login
                            <ArrowRight size={20} />
                        </Link>
                        <Link
                            to="/dashboard"
                            className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-100 rounded-lg font-bold text-lg hover:border-blue-300 transition-all"
                        >
                            Admin Portal
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="bg-white py-16 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 rounded-xl bg-gray-50 border border-gray-100">
                        <Wrench className="w-10 h-10 text-orange-500 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Maintenance</h3>
                        <p className="text-gray-600">Report plumbing or electrical issues instantly and track technician arrival in real-time.</p>
                    </div>
                    <div className="p-6 rounded-xl bg-gray-50 border border-gray-100">
                        <ShieldCheck className="w-10 h-10 text-green-500 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Payments</h3>
                        <p className="text-gray-600">Pay your monthly maintenance bills securely using UPI, Credit Card, or Net Banking.</p>
                    </div>
                    <div className="p-6 rounded-xl bg-gray-50 border border-gray-100">
                        <Building className="w-10 h-10 text-purple-500 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Community Connect</h3>
                        <p className="text-gray-600">Stay updated with apartment notices and connect with your neighbors seamlessly.</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8 text-center">
                <p>© 2026 SmartStay Systems. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
