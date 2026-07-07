import { Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("admin_token");
    
    if (!token) {
        // Redirect to home if not logged in
        return <Navigate to="/" replace />;
    }
    
    return children;
};

export default ProtectedRoute;
