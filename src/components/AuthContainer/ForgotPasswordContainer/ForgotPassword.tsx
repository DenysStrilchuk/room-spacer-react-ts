import React, { useState } from 'react';
import css from './ForgotPassword.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { ClipLoader } from 'react-spinners';
import { authActions } from "../../../store";
import { useAppDispatch } from "../../../hooks/reduxHooks";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const isRegistered = await dispatch(authActions.checkIfRegistered(email)).unwrap();

            if (!isRegistered) {
                setStatus('error');
                toast.error('Email not registered in our system.');
                return;
            }

            await dispatch(authActions.forgotPassword(email)).unwrap();
            setStatus('success');
            toast.success('A password reset link has been sent to your email.');
            setTimeout(() => {
                navigate('/auth/login');
            }, 2000); // Redirect after 2 seconds
        } catch (error: any) {
            setStatus('error');
            toast.error(error?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className={css.forgotPasswordContainer}>
            <form onSubmit={handleSubmit} className={css.forgotPasswordForm}>
                <h2>Password recovery</h2>
                <div className={css.inputContainer}>
                    <FontAwesomeIcon icon={faEnvelope} className={css.icon} />
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={css.forgotPasswordInput}
                    />
                </div>
                <button
                    type="submit"
                    className={css.forgotPasswordButton}
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? (
                        <div className={css.loadingContainer}>
                            <span>Sending...</span>
                            <ClipLoader size={20} color={"#ffffff"} loading={true} />
                        </div>
                    ) : (
                        'Send a link'
                    )}
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export { ForgotPassword };
