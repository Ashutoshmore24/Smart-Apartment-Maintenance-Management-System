import React from "react";
import { Link } from "react-router-dom";
import { Building, ShieldCheck, Wrench, ArrowRight, Database } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">

      {/* ================= HERO SECTION ================= */}
      <div className="flex items-center justify-center flex-grow px-6 py-20">
        <div className="w-full max-w-5xl space-y-10 text-center">

          <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-full shadow-sm">
            <Building className="w-10 h-10 text-blue-600" />
          </div>

          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-6xl">
            Smart Apartment <br />
            <span className="text-blue-600">Maintenance Management</span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-600">
            A centralized digital platform that connects residents,
            technicians, and administrators. Track maintenance requests,
            manage costs transparently, and ensure accountability —
            all powered by a structured relational database system.
          </p>

          <div className="flex flex-col justify-center gap-5 pt-6 sm:flex-row">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white transition transform bg-blue-600 shadow-lg rounded-xl hover:bg-blue-700 hover:-translate-y-1"
            >
              Resident Login
              <ArrowRight size={20} />
            </Link>

            <Link
              to="/register"
              className="flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 transition bg-white border-2 border-blue-200 gap-2px-8 rounded-xl hover:border-blue-400"
            >
                          Register
                          <ArrowRight size={20} />
            </Link>
          </div>

        </div>
      </div>

      {/* ================= FEATURES SECTION ================= */}
      <div className="px-6 py-20 bg-white">
        <div className="mx-auto text-center max-w-7xl mb-14">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Why SmartStay?
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Built using modern web technologies and database principles to ensure structured, secure, and efficient apartment maintenance management.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">

  <div className="flex flex-col items-center p-8 text-center transition border rounded-2xl bg-gray-50 hover:shadow-md">
    <Wrench className="w-12 h-12 mb-4 text-orange-500" />
    <h3 className="mb-2 text-lg font-bold text-gray-900">
      Instant Maintenance
    </h3>
    <p className="text-sm text-gray-600">
      Raise and track maintenance requests in real-time.
    </p>
  </div>

  <div className="flex flex-col items-center p-8 text-center transition border rounded-2xl bg-gray-50 hover:shadow-md">
    <ShieldCheck className="w-12 h-12 mb-4 text-green-500" />
    <h3 className="mb-2 text-lg font-bold text-gray-900">
      Secure Role Access
    </h3>
    <p className="text-sm text-gray-600">
      Role-based login for residents, technicians, and administrators.
    </p>
  </div>

  <div className="flex flex-col items-center p-8 text-center transition border rounded-2xl bg-gray-50 hover:shadow-md">
    <Database className="w-12 h-12 mb-4 text-blue-500" />
    <h3 className="mb-2 text-lg font-bold text-gray-900">
      Structured Database
    </h3>
    <p className="text-sm text-gray-600">
      Ensures data integrity, relationships, and transaction safety.
    </p>
  </div>

  <div className="flex flex-col items-center p-8 text-center transition border rounded-2xl bg-gray-50 hover:shadow-md">
    <Building className="w-12 h-12 mb-4 text-purple-500" />
    <h3 className="mb-2 text-lg font-bold text-gray-900">
      Transparent Billing
    </h3>
    <p className="text-sm text-gray-600">
      Maintenance cost tracking and clear payment logs.
    </p>
  </div>

</div>

      </div>

      {/* ================= FOOTER ================= */}
      <footer className="py-8 text-sm text-center text-gray-400 bg-gray-900">
        <p>© 2026 SmartStay Systems. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default LandingPage;
