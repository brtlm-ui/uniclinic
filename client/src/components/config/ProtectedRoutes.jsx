import React, { useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

const cookies = new Cookies();

const ProtectedRoutes = () => {
    const isValidToken = useMemo(() => {
        const token = cookies.get("TOKEN");
        if (!token) return false;
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken.exp > Date.now() / 1000;
        } catch (error) {
            console.error("Invalid Token: ", error);
            return false;
        }
    }, []);

    if (isValidToken) {
        return <Outlet />;
    } else {
        return <Navigate to="/" />;
    }
    /*
    const decoded = jwt_decode(token);
    console.log(decoded);
    console.log(decoded.superAdmin);

    if (token) {
        return <Outlet />;
    } else {
        return (
            <Navigate to="/" />
        )
    }*/
}

export default ProtectedRoutes;