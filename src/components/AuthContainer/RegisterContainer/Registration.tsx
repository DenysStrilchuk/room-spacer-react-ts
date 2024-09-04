import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import css from './Registration.module.css';
import { faEnvelope, faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { authActions, selectIsRegistered } from "../../../store";
import { RootState } from "../../../types/reduxType";
import {registrationSchema} from "../../../validators/validationSchema";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



interface IFormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    global?: string;
}

const Registration: React.FC = () => {
    const dispatch = useAppDispatch();
    const isRegistered = useSelector(selectIsRegistered); // Використання селектора
    const { error } = useSelector((state: RootState) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formErrors, setFormErrors] = useState<IFormErrors>({});
    const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const validateForm = () => {
        const { error } = registrationSchema.validate(
            { name, email, password, confirmPassword, agreeToTerms },
            { abortEarly: false }
        );
        if (error) {
            const newErrors: IFormErrors = {};
            error.details.forEach((err) => {
                const key = err.path[0] as string; // Перетворення до рядка
                if (['name', 'email', 'password', 'confirmPassword', 'agreeToTerms'].includes(key)) {
                    newErrors[key as keyof IFormErrors] = err.message;
                } else {
                    newErrors.global = err.message;
                }
            });
            return newErrors;
        }
        return {};
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            return;
        }
        setFormErrors({});
        setLoading(true);

        try {
            const isAlreadyRegistered = await dispatch(authActions.checkIfRegistered(email)).unwrap();
            if (isAlreadyRegistered) {
                setFormErrors({ global: 'This email is already registered.' });
            } else {
                const user = await dispatch(authActions.signUp({ email, password, name })).unwrap();
                if (user) {
                    toast.success('Registration Successful! Please check your email to confirm.');
                    setShowConfirmationMessage(true);
                }
            }
        } catch (err: any) {
            if (err.message === 'Please verify your email before proceeding.') {
                setShowConfirmationMessage(true);
            } else {
                console.error('Error during registration:', err);
                setFormErrors({ global: err.message || 'Registration failed' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        if (!agreeToTerms) {
            setFormErrors({ global: 'You must agree to the terms before signing up.' });
            return;
        }

        setGoogleLoading(true);
        try {
            const user = await dispatch(authActions.registerWithGoogleAction()).unwrap();
            if (user) {
                navigate(`/group/${user.uid}`);
            } else {
                setFormErrors({ global: 'Google registration failed' });
            }
        } catch (error) {
            console.error('Error during Google sign-up:', error);
            setFormErrors({ global: 'Google sign-up failed' });
        } finally {
            setGoogleLoading(false);
        }
    };

    useEffect(() => {
        if (isRegistered) {
            setShowConfirmationMessage(true);
        }
    }, [isRegistered]);

    useEffect(() => {
        if (error) {
            setFormErrors({ global: error || 'Registration failed' });
        }
    }, [error]);

    return (
        <div className={css.registerContainer}>
            <form onSubmit={handleSubmit} className={css.registerForm}>
                <h2>Sign Up</h2>
                <div className={css.inputContainer}>
                    <FontAwesomeIcon icon={faUser} className={css.icon}/>
                    <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={css.registerInput}
                    />
                </div>
                <div className={css.inputContainer}>
                    <FontAwesomeIcon icon={faEnvelope} className={css.icon}/>
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={css.registerInput}
                    />
                </div>
                <div className={css.inputContainer}>
                    <FontAwesomeIcon icon={faLock} className={css.icon}/>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={css.registerInput}
                    />
                    <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        className={css.togglePassword}
                        onClick={() => setShowPassword(!showPassword)}
                    />
                </div>
                <div className={css.inputContainer}>
                    <FontAwesomeIcon icon={faLock} className={css.icon}/>
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={css.registerInput}
                    />
                    <FontAwesomeIcon
                        icon={showConfirmPassword ? faEye : faEyeSlash}
                        className={css.togglePassword}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                </div>
                <div className={css.checkboxContainer}>
                    <input
                        type="checkbox"
                        id="agreeToTerms"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className={css.checkboxInput}
                    />
                    <label htmlFor="agreeToTerms" className={css.checkboxLabel}>
                        I agree to <a href="/terms" className={css.link}>Terms</a>,
                        <a href="/privacy" className={css.link}>Privacy</a>,
                        and <a href="/cookies" className={css.link}>Cookie policies</a>.
                    </label>
                </div>
                {Object.keys(formErrors).map((key) => (
                    <p className={css.errorText} key={key}>{formErrors[key as keyof IFormErrors]}</p>
                ))}

                <button type="submit" className={css.registerButton} disabled={loading}>
                    {loading ? (
                        <div className={css.loadingContainer}>
                            <span>Creating...</span>
                            <ClipLoader size={20} color={"#ffffff"} loading={true}/>
                        </div>
                    ) : (
                        'Create your free account'
                    )}
                </button>

                <div className={css.divider}>
                    <span className={css.line}></span>
                    <span className={css.orText}>Or</span>
                    <span className={css.line}></span>
                </div>

                <div className={css.googleButtonContainer}>
                    <button
                        type="button"
                        className={css.googleButton}
                        onClick={handleGoogleSignUp}
                        disabled={googleLoading || !agreeToTerms}
                    >
                        <div className={css.loadingContainer}>


                            <img src={"https://img.icons8.com/?size=100&id=17949&format=png&color=000000"}
                                 alt={'googleIcon'} className={css.googleIcon}/>
                            {googleLoading ? (
                                <>
                                    <span>Signing up with Google...</span>
                                    <ClipLoader size={20} color={"rgb(70,77,97)"} loading={true}/>
                                </>
                            ) : (
                                <span>Sign up with Google</span>
                            )}
                        </div>
                    </button>
                </div>

                <div className={css.signInContainer}>
                    <p className={css.haveAccountText}>Already have an account?</p>
                    <Link to="/auth/login" className={css.signInLink}>Sign In</Link>
                </div>
            </form>

            <ToastContainer />
            {showConfirmationMessage && (
                toast.success('Registration Successful! Please check your email to confirm.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            )}
        </div>
    );
};

export { Registration };
