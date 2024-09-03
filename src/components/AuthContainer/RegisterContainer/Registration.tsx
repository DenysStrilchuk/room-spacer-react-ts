import React, { useState } from 'react';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useNavigate } from 'react-router-dom';
import { authActions } from "../../../store";

const Registration = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            alert('Паролі не співпадають');
            return;
        }
        const result = await dispatch(authActions.signUp({ email, password }));
        if (result.meta.requestStatus === 'fulfilled') {
            alert('Будь ласка, підтвердіть вашу електронну пошту');
            navigate('/email-confirmation');
        }
    };

    const handleGoogleSignUp = async () => {
        const result = await dispatch(authActions.loginGoogle());
        if (result.meta.requestStatus === 'fulfilled') {
            navigate('/home'); // Перенаправлення на домашню сторінку після успішної реєстрації
        } else {
            alert('Щось пішло не так при спробі увійти за допомогою Google');
        }
    };

    return (
        <div>
            <h2>Реєстрація</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Підтвердьте пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handleSignUp}>Зареєструватися</button>
            <button onClick={handleGoogleSignUp}>Зареєструватися за допомогою Google</button>
        </div>
    );
};

export { Registration };
