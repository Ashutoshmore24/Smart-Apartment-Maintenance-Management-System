const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://smart-apartment-backend-production.up.railway.app";

const GoogleButton = () => {

    const handleGoogleLogin = () => {
        window.location.href = `${BACKEND_URL}/auth/google`;
    };

    return (
        <button
            onClick={handleGoogleLogin}
            style={{
                padding: "10px 20px",
                background: "#4285F4",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
            }}
        >
            Continue with Google
        </button>
    );
};

export default GoogleButton;