import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Loading from "../Loading";
import { Navigate } from "react-router-dom";

export default function RoleProtectedRoute({ children, allowedRoles = []}) {
    const { isLoggedIn, user, loading } = useContext(AuthContext);

    if (loading) {
        return <Loading />;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0) {
        const userRole = user?.role; 
        
        if (!allowedRoles.includes(userRole)) {
            return <Navigate to="/" replace />;
        }
    }

    return children;
}