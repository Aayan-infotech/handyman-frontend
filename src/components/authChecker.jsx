import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthChecker = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token =
        localStorage.getItem("hunterToken") ||
        localStorage.getItem("ProviderToken");
      const userType = localStorage.getItem("hunterToken")
        ? "hunter"
        : "provider";
      const refreshToken = localStorage.getItem("hunterRefreshToken") || localStorage.getItem("ProviderRefreshToken");

      if (!token) {
        navigate("/welcome");
        return;
      }

      try {
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        if (tokenData.exp * 1000 < Date.now()) {
          if (refreshToken) {
            const response = await axios.post(
              "http://3.223.253.106:7777/api/auth/refreshtoken",
              { refreshToken, userType }
            );
            if (userType === "hunter") {
              localStorage.setItem("hunterToken", response.data.accessToken);
              return;
            }
            localStorage.setItem("ProviderToken", response.data.accessToken);
          } else {
            navigate("/welcome");
          }
        }
      } catch (error) {
        console.error("Token validation error:", error);
        navigate("/welcome");
      }
    };

    checkToken();
  }, [navigate]);

  return children;
};

export default AuthChecker;
