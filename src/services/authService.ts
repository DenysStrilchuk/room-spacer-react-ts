import { auth, db } from '../firebase/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { setDoc, doc, getDoc} from 'firebase/firestore';

export const signUpWithEmail = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        role: 'Owner', // При реєстрації новий користувач є Owner
    });
    return userCredential.user;
};

export const loginWithEmail = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const userDoc = doc(db, 'users', result.user.uid);
    const userSnapshot = await getDoc(userDoc);
    if (!userSnapshot.exists()) {
        await setDoc(userDoc, {
            email: result.user.email,
            role: 'User', // Новий користувач за замовчуванням є звичайним користувачем
        });
    }
    return result.user;
};

export const logout = () => {
    return signOut(auth);
};
