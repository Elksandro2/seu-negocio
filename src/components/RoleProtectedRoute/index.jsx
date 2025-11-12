import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export default function RoleProtectedRoute({ children, allowedRoles = []}) {
    const { isLoggedIn, user, loading } = useContext(AuthContext);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0) {
        const userRole = user?.role; 
        
        if (!userRole || !allowedRoles.includes(userRole)) {
            return <Navigate to="/" replace />;
        }
    }

    return children;
}