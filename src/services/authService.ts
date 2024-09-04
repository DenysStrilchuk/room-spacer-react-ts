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
    getDoc,
    collection,
    query,
    where,
    getDocs
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

    checkIfUserExistsInFirestore: async (email: string): Promise<boolean> => {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        return !querySnapshot.empty;
    },

    loginWithGoogle: async (): Promise<UserCredential | null> => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            const user = result.user;
            const email = user.email;

            if (!email) {
                console.error('Google account does not have an email address associated.');
                return null;
            }

            const userExists = await authService.checkIfUserExistsInFirestore(email);

            if (!userExists) {
                // Remove the user from Firebase Authentication if they don't exist in Firestore
                await user.delete();
                console.error('User not registered. Please sign up first.');
                return null;
            }

            // Check if user exists in Firestore
            const userDoc = doc(db, 'users', user.uid);
            const userSnapshot = await getDoc(userDoc);

            if (userSnapshot.exists()) {
                // User exists, continue with sign-in
                return result;
            } else {
                console.error('User not registered. Please sign up first.');
                return null;
            }
        } catch (error) {
            // Log the error and return null
            console.error('Google login error:', (error as Error).message || String(error));
            return null;
        }
    },

    registerWithGoogle: async (): Promise<UserCredential | null> => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const userDoc = doc(db, 'users', result.user.uid);

        // Створюємо запис користувача у Firestore
        await setDoc(userDoc, {
            email: result.user.email,
            name: result.user.displayName,
            role: 'Owner',
        });

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
