import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute() {
    const [isAuthorized, setIsAuthorized] = useState(null); // Tracks the authorization state

    useEffect(() => {
        auth().catch((error) => {
            console.error('Error during authorization:', error); // Debugging line
            setIsAuthorized(false);
        });
    }, []);

    // Function to refresh the token using the refresh token
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        console.log('Attempting to refresh token with:', refreshToken); // Debugging line

        try {
            const res = await api.post("/api/token/refresh/", { refresh: refreshToken });
            console.log('Token refresh response:', res); // Debugging line

            if (res.status === 200) {
                // Store the new access token and set authorized state
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);  // Successfully refreshed, set authorization to true
            } else {
                console.log('Failed to refresh token'); // Debugging line
                setIsAuthorized(false);  // Refresh failed, set unauthorized
            }
        } catch (error) {
            console.log('Error refreshing token:', error); // Debugging line
            setIsAuthorized(false);  // Refresh failed, set unauthorized
        }
    };

    // Function to authenticate the user by checking the token validity
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        console.log('Current access token:', token); // Debugging line

        if (!token) {
            console.log('No access token found'); // Debugging line
            setIsAuthorized(false);  // No token found, set unauthorized
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const tokenExpiration = decoded.exp;
            const now = Date.now() / 1000;
            console.log('Token expiration:', tokenExpiration); // Debugging line
            console.log('Current time:', now); // Debugging line

            // If the token has expired, try refreshing it
            if (tokenExpiration < now) {
                console.log('Token has expired, attempting to refresh...'); // Debugging line
                await refreshToken();  // Try to refresh the token
            } else {
                console.log('Token is valid, user is authorized.'); // Debugging line
                setIsAuthorized(true);  // Token is valid, set authorized
            }
        } catch (error) {
            console.log('Error decoding token:', error); // Debugging line
            setIsAuthorized(false);  // Token is invalid, set unauthorized
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;  // While checking authorization, show loading state
    }

    // If authorized, show the children routes (via <Outlet />); otherwise, redirect to login
    return isAuthorized ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
