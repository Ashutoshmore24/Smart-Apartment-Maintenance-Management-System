import React from "react";
import aboutImg from "../assets/SAMPLEIMG.webp";
import { Phone, MapPin, Mail } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">

      {/* ================= HEADER ================= */}
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

      {/* ================= MAIN CONTENT ================= */}
      <div className="px-6 py-16 mx-auto max-w-7xl">

        {/* Mission Section */}
        <div className="grid items-center grid-cols-1 gap-16 mb-20 md:grid-cols-2">

          {/* Text */}
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


          {/* Image */}
          <div className="overflow-hidden shadow-2xl h-96 rounded-2xl">
            <img
              src={aboutImg}
              alt="SmartStay Mission"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* ================= FEATURES / VALUES ================= */}
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

        {/* ================= CONTACT SECTION ================= */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

          <div className="p-8 text-center bg-gray-50 rounded-2xl dark:bg-gray-800">
            <div className="flex items-center justify-center mx-auto mb-4 text-blue-600 bg-blue-100 rounded-full w-14 h-14 dark:bg-blue-900 dark:text-blue-300">
              <Phone size={26} />
            </div>
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
              24/7 Support
            </h3>
            <p className="text-gray-600 dark:text-gray-300">+91 98765XXXXXX</p>
          </div>

          <div className="p-8 text-center bg-gray-50 rounded-2xl dark:bg-gray-800">
            <div className="flex items-center justify-center mx-auto mb-4 text-green-600 bg-green-100 rounded-full w-14 h-14 dark:bg-green-900 dark:text-green-300">
              <Mail size={26} />
            </div>
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
              Email Us
            </h3>
            <p className="text-gray-600 dark:text-gray-300">support@smartstay.com</p>
          </div>

          <div className="p-8 text-center bg-gray-50 rounded-2xl dark:bg-gray-800">
            <div className="flex items-center justify-center mx-auto mb-4 text-purple-600 bg-purple-100 rounded-full w-14 h-14 dark:bg-purple-900 dark:text-purple-300">
              <MapPin size={26} />
            </div>
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
              Office
            </h3>
            <p className="text-gray-600 dark:text-gray-300">Tech Park, Bangalore</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AboutPage;
