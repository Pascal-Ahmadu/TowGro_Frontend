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
    loginSuccess(state) {
      state.isAuthenticated = true;
      state.sessionValidated = true;
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.sessionValidated = false;
    },
    sessionValidated(state) {
      state.sessionValidated = true;
    }
  }
});

export const { loginSuccess, logoutSuccess, sessionValidated } = authSlice.actions;
export default authSlice.reducer;