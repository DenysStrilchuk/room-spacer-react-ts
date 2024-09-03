import React, { useState } from 'react';
import {useAppDispatch} from "../../../hooks/reduxHooks";
import {authActions} from "../../../store";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const dispatch = useAppDispatch();

    const handleForgotPassword = async () => {
        await dispatch(authActions.forgotPassword(email));
        alert('A password reset email has been sent to your email address.');
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleForgotPassword}>Reset Password</button>
        </div>
    );
};

export {ForgotPassword};
