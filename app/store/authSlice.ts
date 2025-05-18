import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  sessionValidated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  sessionValidated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.loading = false; // Ensure loading is set to false on success
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isAuthenticated = false;
      state.loading = false; // Ensure loading is set to false on failure
      state.error = action.payload; // Assuming error is in action.payload
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.sessionValidated = false;
      state.loading = false; // Ensure loading is set to false on logout
      state.error = null;
    },
    sessionValidated: (state) => {
      state.sessionValidated = true;
      // loading state might not change here depending on your logic
    },
  }
});

export const { loginStart, loginSuccess, loginFailure, logoutSuccess, sessionValidated } = authSlice.actions;
export default authSlice.reducer;