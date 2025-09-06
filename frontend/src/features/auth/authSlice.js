import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import { setAccessToken } from "./tokenSlice.js";
import { decodedToken } from '../../utlis/decodedToken.js';
// import axiosInst ance from '../../services/axiosInstance.js';

const API_URL = import.meta.env.VITE_NODE_URI;

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  isInitialized: false,
};

// -------------------- REGISTER --------------------
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      dispatch(setAccessToken(response.data.accessToken));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Server error" });
    }
  }
);

// -------------------- LOGIN --------------------
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      dispatch(setAccessToken(response.data.accessToken));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Server error" });
    }
  }
);

// -------------------- REFRESH TOKEN --------------------
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/refresh-token`,
        {},
        { headers: { "x-client-type": "web" }, withCredentials: true }
      );

      const { accessToken } = response.data;
      dispatch(setAccessToken(accessToken));
      return response.data;
    } catch (error) {
      // ✅ Silent fail if no refresh token
      if (error.response?.status === 401) {
        return rejectWithValue({ message: null }); 
      }
      return rejectWithValue(error.response?.data || { message: "Server error" });
    }
  }
);



export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
        await axios.post(`${API_URL}/auth/logout`, {}, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });
        return true;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Server error" });
    }
});

// -------------------- SLICE --------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const accessToken = action.payload.accessToken;
        if (accessToken) {
          const decoded = decodedToken(accessToken);
          state.user = decoded.user;
          state.isAuthenticated = true;
        }
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.isAuthenticated = !!action.payload.accessToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
        state.isInitialized = true; 
      })

      // REFRESH TOKEN
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        const accessToken = action.payload.accessToken;
        if (accessToken) {
          const decoded = decodedToken(accessToken);
          state.user = decoded.user;
          state.isAuthenticated = true;
        }
        state.loading = false;
        state.isInitialized = true;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.isInitialized = true; 
        // 👇 Don’t show "No token provided" error to UI
        if (action.payload?.message) {
          state.error = action.payload.message;
        } else {
          state.error = null;
        }
      })

      // LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Logout failed";
        state.isInitialized = true;
      });
  }
});

export const { clearAuthError } = authSlice.actions;
export const { setInitialized } = authSlice.actions;
export default authSlice.reducer;
