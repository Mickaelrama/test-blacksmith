import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import roles from "../../constants/roles";

const AuthGuard = ({ children, role }) => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login"); // redirection to the /login
    } else {
      const decodedToken = jwtDecode(token);
      if (decodedToken) {
        // redirect to the login page if the current user hasn't access
        if (roles[decodedToken.role] && !roles[role].includes(role)) {
          navigate("/login");
        }
      }
    }
  }, [token, navigate, role]);

  return children;
};

export default AuthGuard;
