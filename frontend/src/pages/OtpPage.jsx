import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://smart-apartment-backend-production.up.railway.app";

const OtpPage = () => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { checkAuth } = useAuth(); // Import checkAuth

    const userId = params.get("userId");

    const handleSubmit = async () => {
        if (!otp) return setError("Please enter OTP");
        setLoading(true);
        setError(null);
        try {
            await axios.post(
                `${BACKEND_URL}/auth/verify-otp` || "https://smart-apartment-backend-production.up.railway.app/auth/verify-otp",
                { userId, otp },
                { withCredentials: true }
            );

            // Fetch the user data through cookie
            await checkAuth();
            alert("Login successful");
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border dark:border-gray-700">
                <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">Enter OTP</h2>
                <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">An OTP has been sent to your email.</p>
                
                {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
                
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full p-3 mb-6 text-lg tracking-widest text-center border rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    maxLength={6}
                />

                <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="w-full px-4 py-3 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>
            </div>
        </div>
    );
};

export default OtpPage;