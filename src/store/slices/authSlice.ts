import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {authService} from "../../services/authService";
import {RootState} from "../../types/reduxType";


export interface AuthState {
    user: any;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    status: 'idle',
    error: null,
};

export const selectIsLogin = (state: RootState) => !!state.auth.user;

const signUp = createAsyncThunk('auth/signUp', async ({ email, password }: { email: string; password: string }) => {
    const user = await authService.signUpWithEmail(email, password);
    // Відправка користувача на сторінку підтвердження email
    if (!user.emailVerified) {
        throw new Error('Please verify your email before proceeding.');
    }
    return user;
});

const login = createAsyncThunk('auth/login', ({ email, password }: { email: string; password: string }) => {
    return authService.loginWithEmail(email, password);
});

const loginGoogle = createAsyncThunk('auth/loginGoogle', () => {
    return authService.loginWithGoogle();
});

const logoutUser = createAsyncThunk('auth/logout', () => {
    return authService.logout();
});

const forgotPassword = createAsyncThunk('auth/forgotPassword', (email: string) => {
    return authService.sendPasswordResetEmail(email);
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(signUp.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
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
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.status = 'idle';
            })
            .addCase(forgotPassword.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

const { reducer: authReducer, actions } = authSlice;

const authActions = {
    ...actions,
    signUp,
    login,
    loginGoogle,
    logoutUser,
    forgotPassword
}

export {
    authReducer,
    authActions,
};
