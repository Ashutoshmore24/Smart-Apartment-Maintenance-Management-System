/* Everything Ready */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PaymentPage from './pages/PaymentPage';
import AboutPage from './pages/AboutPage';
import AdminDashboard from './pages/AdminDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import OtpPage from './pages/OtpPage'; // ✅ NEW
import AuthSuccess from "./pages/AuthSuccess";



function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen font-sans text-gray-900 transition-colors duration-300 bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* ✅ OTP ROUTE */}
              <Route path="/otp" element={<OtpPage />} />
              <Route path="/auth-success" element={<AuthSuccess />} />

              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/payments" element={<PaymentPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/technician-dashboard" element={<TechnicianDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;