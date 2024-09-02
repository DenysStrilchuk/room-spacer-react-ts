import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {loginWithEmail, loginWithGoogle, logout, signUpWithEmail} from "../../services/authService";

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

export const signUp = createAsyncThunk('auth/signUp', async ({ email, password }: { email: string; password: string }) => {
    const user = await signUpWithEmail(email, password);
    return user;
});

export const login = createAsyncThunk('auth/login', async ({ email, password }: { email: string; password: string }) => {
    const user = await loginWithEmail(email, password);
    return user;
});

export const loginGoogle = createAsyncThunk('auth/loginGoogle', async () => {
    const user = await loginWithGoogle();
    return user;
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
    await logout();
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
            });
    },
});

export default authSlice.reducer;
