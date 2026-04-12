/* Everything Ready */
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://smart-apartment-maintenance-management-w8ds.onrender.com";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const handleAuth = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/auth/me`, {
          withCredentials: true,
        });
        if (cancelled) return;
        if (res.data?.user) {
          login(res.data.user, res.data.role);
          navigate("/dashboard", { replace: true });
          return;
        }
        navigate("/login", { replace: true });
      } catch {
        if (!cancelled) navigate("/login", { replace: true });
      }
    };

    handleAuth();
    return () => {
      cancelled = true;
    };
  }, [login, navigate]);

  return <div>Logging you in...</div>;
};

export default AuthSuccess;