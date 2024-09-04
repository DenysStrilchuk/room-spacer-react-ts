// router.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts';
import {ConfirmEmailPage, ForgotPasswordPage, GroupPage, LoginPage, RegisterPage, ResetPasswordPage} from "./pages";
import {PrivateRoute} from "./components";

const router = createBrowserRouter([
    {
        path: '',
        element: <MainLayout />,
        children: [
            { path: '', element: <Navigate to="/auth/login" replace /> },
            { path: 'auth/register', element: <RegisterPage /> },
            { path: 'auth/login', element: <LoginPage /> },
            { path: 'auth/recovery', element: <ForgotPasswordPage /> },
            { path: 'auth/reset-password/:token', element: <ResetPasswordPage /> },
            { path: 'auth/confirm/:token', element: <ConfirmEmailPage /> },
            {
                path: 'group/:id',
                element: (
                    <PrivateRoute>
                        <GroupPage />
                    </PrivateRoute>
                ),
            },
        ],
    },
]);

export { router };
