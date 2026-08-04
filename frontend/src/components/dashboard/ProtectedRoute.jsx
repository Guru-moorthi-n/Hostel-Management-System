import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute ({children, allowedRoles}) {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userRole = localStorage.getItem("role");

    if(!isLoggedIn) {
        return <Navigate to="/" />;
    }

    if(!allowedRoles.includes(userRole)) {
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute;