import {auth, db} from '../firebase/firebaseConfig';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    sendPasswordResetEmail as firebaseSendPasswordResetEmail,
    sendEmailVerification
} from 'firebase/auth';
import {
    setDoc,
    doc,
    getDoc
} from 'firebase/firestore';

const authService = {
    signUpWithEmail: async (email: string, password: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user); // Відправка email підтвердження
        return userCredential.user;
    },

    loginWithEmail: (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    },

    loginWithGoogle: async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const userDoc = doc(db, 'users', result.user.uid);
        const userSnapshot = await getDoc(userDoc);
        if (!userSnapshot.exists()) {
            await setDoc(userDoc, {
                email: result.user.email,
                role: 'User',
            });
        }
        return result.user;
    },

    logout: () => {
        return signOut(auth);
    },

    sendPasswordResetEmail: async (email: string) => {
        await firebaseSendPasswordResetEmail(auth, email);
        return `Password reset email sent to ${email}`;
    }
}

export {
    authService
}