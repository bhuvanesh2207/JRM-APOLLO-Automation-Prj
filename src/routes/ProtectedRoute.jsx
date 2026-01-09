import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/auth/check/", {
        withCredentials: true,
      })
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) {
    return <div>Checking authentication...</div>;
  }

  return isAuth ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
