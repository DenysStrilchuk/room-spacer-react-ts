import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from "../firebase/firebaseConfig";
import { useAppDispatch } from "./reduxHooks";
import { authActions } from "../store";

const useAuthListener = () => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true); // Стан завантаження

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch(authActions.setUser({
                    uid: user.uid,
                    email: user.email,
                }));
            } else {
                dispatch(authActions.logoutUser());
            }
            setIsLoading(false); // Завершуємо завантаження після автентифікації
        });

        return () => unsubscribe();
    }, [dispatch]);

    return isLoading; // Повертаємо стан завантаження
};

export { useAuthListener };
