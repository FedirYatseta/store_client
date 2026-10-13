import { createSlice } from "@reduxjs/toolkit";

export const TOKEN_KEY = "token";

const initialState = {
  token: localStorage.getItem(TOKEN_KEY), // Restore the session after a page reload.
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, { payload }) {
      state.token = payload.token;
      state.user = payload.user;
    },
    setUser(state, { payload }) {
      state.user = payload;
    },
    clearCredentials(state) {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setCredentials, setUser, clearCredentials } = authSlice.actions;
export default authSlice.reducer;

export const selectToken = (state) => state.auth.token;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAdmin = (state) => state.auth.user?.role === "admin";