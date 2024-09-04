import React from 'react';
import { useNavigate } from 'react-router-dom';
import {useAppDispatch} from "../../hooks/reduxHooks";
import {authActions} from "../../store";

const Group: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await dispatch(authActions.logoutUser()).unwrap();
            navigate('/auth/login'); // Перенаправляє на сторінку логінації після виходу
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div>
            <h1>Group</h1>
            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export { Group };
