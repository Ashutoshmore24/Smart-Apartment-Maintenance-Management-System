import React from "react";
import aboutImg from "../assets/apartmentimg.webp";

import { Phone, MapPin, Mail } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="transition-colors duration-300 bg-white dark:bg-gray-900">

      {/* Header */}
      <div className="px-6 py-20 text-center text-white bg-gray-900 dark:bg-black">
        <h1 className="mb-6 text-4xl font-bold md:text-5xl">
          About SmartStay
        </h1>
        <p className="max-w-3xl mx-auto leading-relaxed text-gray-400">
          SmartStay is a Smart Apartment Maintenance Management System
          designed to streamline communication between residents,
          technicians, and administrators. It ensures structured request
          handling, cost tracking, and transparent maintenance management
          through a centralized digital platform.
        </p>
      </div>

      {/* Main Content */}
      <div className="px-6 py-16 mx-auto max-w-7xl">

        {/* Mission Section */}
        <div className="grid items-center grid-cols-1 gap-16 mb-20 md:grid-cols-2">

          <div className="max-w-xl">
            <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
              Our Mission
            </h2>
            <div className="space-y-6 leading-relaxed text-left text-gray-600 dark:text-gray-300">
              <p>
                Our mission is to simplify and digitize apartment maintenance
                management by building a centralized system that connects
                residents, technicians, and administrators in a structured
                and transparent workflow.
              </p>
              <p>
                By eliminating manual tracking and communication gaps,
                SmartStay ensures every maintenance request is recorded,
                monitored, and resolved with accountability. Leveraging
                relational database design and modern web technologies,
                the system improves operational efficiency while maintaining
                financial transparency.
              </p>
            </div>
          </div>

          <div className="overflow-hidden shadow-2xl h-96 rounded-2xl">
            <img
              src={aboutImg}
              alt="SmartStay Mission"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 gap-10 mb-20 text-center md:grid-cols-3">
          <div className="p-8 transition shadow-sm bg-gray-50 rounded-2xl hover:shadow-md dark:bg-gray-800">
            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
              Transparency
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Real-time tracking of maintenance requests and cost visibility
              ensures accountability between residents and technicians.
            </p>
          </div>

          <div className="p-8 transition shadow-sm bg-gray-50 rounded-2xl hover:shadow-md dark:bg-gray-800">
            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
              Efficiency
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Structured database design enables faster request handling,
              better monitoring, and organized maintenance records.
            </p>
          </div>

          <div className="p-8 transition shadow-sm bg-gray-50 rounded-2xl hover:shadow-md dark:bg-gray-800">
            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
              Reliability
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Role-based access control and secure data handling ensure
              system integrity and smooth coordination.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 mb-20">
          <div className="p-8 text-center bg-gray-50 rounded-2xl dark:bg-gray-800">
            <div className="flex items-center justify-center mx-auto mb-4 text-blue-600 bg-blue-100 rounded-full w-14 h-14 dark:bg-blue-900 dark:text-blue-300">
              <Phone size={26} />
            </div>
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">24/7 Support</h3>
            <p className="text-gray-600 dark:text-gray-300">+91 951500XXXX </p>
          </div>

          <div className="p-8 text-center bg-gray-50 rounded-2xl dark:bg-gray-800">
            <div className="flex items-center justify-center mx-auto mb-4 text-green-600 bg-green-100 rounded-full w-14 h-14 dark:bg-green-900 dark:text-green-300">
              <Mail size={26} />
            </div>
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Email Us</h3>
            <p className="text-gray-600 dark:text-gray-300">support.smartstay2026@gmail.com</p>
          </div>

          <div className="p-8 text-center bg-gray-50 rounded-2xl dark:bg-gray-800">
            <div className="flex items-center justify-center mx-auto mb-4 text-purple-600 bg-purple-100 rounded-full w-14 h-14 dark:bg-purple-900 dark:text-purple-300">
              <MapPin size={26} />
            </div>
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Head Office</h3>
            <p className="text-gray-600 dark:text-gray-300">IT Park,Hinjewadi,Pune</p>
          </div>
        </div>

        {/* Authors / Developers Section */}
        <div className="text-center mb-10">
          <h2 className="mb-12 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
            Meet the Developers
          </h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {/* Developer 1 */}
            <div className="p-8 bg-white shadow-lg rounded-2xl dark:bg-gray-800 dark:border dark:border-gray-700">
              <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full ring-4 ring-blue-100 dark:ring-gray-700">
                <img
                  src="/author1.jpeg"
                  alt="Ashutosh More"
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Ashutosh More</h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">Lead Developer</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Full-stack enthusiast focused on scalable web applications and intuitive UI design.
              </p>
            </div>

            {/* Developer 2 */}
            <div className="p-8 bg-white shadow-lg rounded-2xl dark:bg-gray-800 dark:border dark:border-gray-700">
              <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full ring-4 ring-blue-100 dark:ring-gray-700">
                <img
                  src="/author2.jpeg"
                  alt="Aniket Gawande"
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Aniket Gawande</h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">Backend Engineer</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Specializes in robust APIs, database architecture, and systematic server infrastructure.
              </p>
            </div>

            {/* Developer 3 */}
            <div className="p-8 bg-white shadow-lg rounded-2xl dark:bg-gray-800 dark:border dark:border-gray-700">
              <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full ring-4 ring-blue-100 dark:ring-gray-700">
                <img
                  src="/author3.jpeg"
                  alt="Atharv Shinde"
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Atharv Shinde</h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">Frontend Developer</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Passionate about creating modern, accessible, and responsive user interfaces.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
