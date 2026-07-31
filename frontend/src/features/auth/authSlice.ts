import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "./types";

const initialState: AuthState = {
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isAuthenticated:
    typeof window !== "undefined" ? !!localStorage.getItem("token") : false,
  loading: false,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (
      state,
      action: PayloadAction<{ email: string; password: string }>,
    ) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },

    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      state.success = true;
      localStorage.setItem("token", action.payload.token);
    },

    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.success = false;
      localStorage.removeItem("token");
    },

    clearError: (state) => {
      state.error = null;
    },

    clearSuccess: (state) => {
      state.success = false;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  clearSuccess,
} = authSlice.actions;

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectAuthSuccess = (state: { auth: AuthState }) =>
  state.auth.success;

export default authSlice.reducer;
