import React from "react";
import { Navigate, replace } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  allowedRoles,
}) => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken: any = jwtDecode(token);
    const userRole =
      decodedToken[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ];

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }

    return <>{element}</>;
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
