import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute() {
    const [isAuthorized, setIsAuthorized] = useState(null); // Tracks the authorization state

    useEffect(() => {
        auth().catch((error) => {
            console.error('Error during authorization:', error);
            setIsAuthorized(false);
        });
    }, []);

    // Function to refresh token using the refresh token
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN) || sessionStorage.getItem(REFRESH_TOKEN);

        try {
            const res = await api.post("/api/token/refresh/", { refresh: refreshToken });

            if (res.status === 200) {
                // Store the new access token and set authorized state
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            setIsAuthorized(false);
        }
    };

    // Function to authenticate user by checking token validity
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);

        if (!token) {
            setIsAuthorized(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const tokenExpiration = decoded.exp;
            const now = Date.now() / 1000;

            if (tokenExpiration < now) {
                await refreshToken();
            } else {
                setIsAuthorized(true);
            }
        } catch (error) {
            setIsAuthorized(false);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
