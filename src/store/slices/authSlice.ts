import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from "../../services/authService";
import { RootState } from "../../types/reduxType";
import {IUser} from "../../intterfaces/userInterface";

export interface AuthState {
    user: IUser | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    isRegistered: boolean;
}

const initialState: AuthState = {
    user: null,
    status: 'idle',
    error: null,
    isRegistered: false,  // Параметр для перевірки реєстрації
};

// Селектори
export const selectIsLogin = (state: RootState) => !!state.auth.user;
export const selectIsRegistered = (state: RootState) => state.auth.isRegistered;

// Асинхронні екшени
const signUp = createAsyncThunk('auth/signUp', async ({ email, password, name }: { email: string; password: string; name: string }) => {
    const user = await authService.signUpWithEmail(email, password, name);
    if (!user.emailVerified) {
        throw new Error('Please verify your email before proceeding.');
    }
    return user;
});

const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }): Promise<IUser> => {
        const userCredential = await authService.loginWithEmail(email, password);
        const user = userCredential.user;

        if (!user.email) {
            throw new Error('Email is null');
        }
        return {
            uid: user.uid,
            email: user.email,
        };
    }
);

const checkIfRegistered = createAsyncThunk('auth/checkIfRegistered', async (email: string) => {
    return await authService.checkIfRegistered(email); // Логіка перевірки реєстрації
});

const loginGoogle = createAsyncThunk(
    'auth/loginGoogle',
    async (): Promise<IUser> => {
        const userCredential = await authService.loginWithGoogle();
        const user = userCredential.user;
        return {
            uid: user.uid,
            email: user.email,
        };
    }
);

const logoutUser = createAsyncThunk('auth/logout', () => {
    return authService.logout();
});

const forgotPassword = createAsyncThunk('auth/forgotPassword', (email: string) => {
    return authService.sendPasswordResetEmail(email);
});

// Слайс
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // signUp
            .addCase(signUp.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.isRegistered = true;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            // login
            .addCase(login.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            // loginGoogle
            .addCase(loginGoogle.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginGoogle.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(loginGoogle.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            // logoutUser
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.status = 'idle';
            })
            // forgotPassword
            .addCase(forgotPassword.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            // checkIfRegistered
            .addCase(checkIfRegistered.fulfilled, (state, action) => {
                state.isRegistered = action.payload;
            })
            .addCase(checkIfRegistered.rejected, (state, action) => {
                state.isRegistered = false;
                state.error = action.error.message || null;
            });
    },
});

// Експортуємо ред'юсер та екшени
const { reducer: authReducer, actions } = authSlice;

const authActions = {
    ...actions,
    signUp,
    login,
    loginGoogle,
    logoutUser,
    forgotPassword,
    checkIfRegistered,  // Додали екшен для перевірки реєстрації
};

export {
    authReducer,
    authActions,
};
