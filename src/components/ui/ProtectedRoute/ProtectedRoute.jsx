import { Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("admin_token");
    
    if (!token) {
        // Redirect to home and trigger login modal
        return <Navigate to="/" replace state={{ showLogin: true }} />;
    }
    
    return children;
};

export default ProtectedRoute;
