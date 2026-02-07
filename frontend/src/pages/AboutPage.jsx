import React from 'react';
import { Users, Phone, MapPin, Mail } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="bg-white">
            {/* Header */}
            <div className="bg-gray-900 text-white py-20 px-6 text-center">
                <h1 className="text-4xl font-bold mb-4">About SmartStay</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    We are dedicated to providing the best living experience for our residents through smart technology and efficient management.
                </p>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            To revolutionize apartment maintenance by connecting residents, technicians, and management in one seamless ecosystem. We believe that a well-maintained home is a happy home.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Established in 2024, SmartStay manages over 500 premium apartments across the city, ensuring 24/7 support and rapid issue resolution.
                        </p>
                    </div>
                    <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center">
                        <Users size={64} className="text-gray-300" />
                        <span className="sr-only">Team Image Placeholder</span>
                    </div>
                </div>

                {/* Contact Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 bg-gray-50 rounded-xl text-center">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Phone size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">24/7 Support</h3>
                        <p className="text-gray-600">+91 98765 43210</p>
                    </div>
                    <div className="p-8 bg-gray-50 rounded-xl text-center">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Email Us</h3>
                        <p className="text-gray-600">support@smartstay.com</p>
                    </div>
                    <div className="p-8 bg-gray-50 rounded-xl text-center">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Office</h3>
                        <p className="text-gray-600">Tech Park, Bangalore</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
