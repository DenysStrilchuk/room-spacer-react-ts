import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLogin } from "../../store";

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const isAuthenticated = useSelector(selectIsLogin);

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    return <>{children}</>;
};
