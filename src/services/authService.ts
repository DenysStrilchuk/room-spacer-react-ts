import { auth, db } from '../firebase/firebaseConfig';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    sendPasswordResetEmail as firebaseSendPasswordResetEmail,
    sendEmailVerification,
    UserCredential
} from 'firebase/auth';
import {
    setDoc,
    doc,
    getDoc
} from 'firebase/firestore';

const authService = {
    signUpWithEmail: async (email: string, password: string, name: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user); // Відправка email підтвердження

        // Збереження користувача в Firestore з ім'ям
        const userDoc = doc(db, 'users', userCredential.user.uid);
        await setDoc(userDoc, {
            email: email,
            name: name,
            role: 'Owner',
        });

        return userCredential.user;
    },

    loginWithEmail: (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    },

    loginWithGoogle: async (): Promise<UserCredential>  => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const userDoc = doc(db, 'users', result.user.uid);
        const userSnapshot = await getDoc(userDoc);

        if (!userSnapshot.exists()) {
            // Якщо користувач новий, зберігаємо ім'я та email в Firestore
            await setDoc(userDoc, {
                email: result.user.email,
                name: result.user.displayName,  // Використовуємо ім'я з Google
                role: 'User',
            });
        }

        return result;
    },

    logout: () => {
        return signOut(auth);
    },

    sendPasswordResetEmail: async (email: string) => {
        await firebaseSendPasswordResetEmail(auth, email);
        return `Password reset email sent to ${email}`;
    },

    checkIfRegistered: async (email: string) => {
        const userDoc = doc(db, 'users', email);
        const userSnapshot = await getDoc(userDoc);
        return userSnapshot.exists();
    }
};

export {
    authService
};
