import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        await checkAuth(); // fetch user using cookie
        navigate("/dashboard"); // 🔥 change if your route differs
      } catch (err) {
        navigate("/login");
      }
    };

    handleAuth();
  }, []);

  return <div>Logging you in...</div>;
};

export default AuthSuccess;