import React, { useState } from 'react';
import css from './ForgotPassword.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { ClipLoader } from 'react-spinners';
import {authActions} from "../../../store";
import {useAppDispatch} from "../../../hooks/reduxHooks";

const ForgotPassword = () => {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            await dispatch(authActions.forgotPassword(email)).unwrap();  // Передаємо тільки рядок email
            setStatus('success');
            setMessage('A password reset link has been sent to your email.');
        } catch (error: any) {
            setStatus('error');
            setMessage(error?.message || 'An error occurred. Please try again.');
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
                {message && (
                    <p
                        className={
                            status === 'success'
                                ? css.successMessage
                                : css.errorMessage
                        }
                    >
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
};

export { ForgotPassword };
