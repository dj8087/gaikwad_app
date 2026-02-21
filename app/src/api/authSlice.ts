// src/redux/slices/authSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from ".";

/* ---------------- TYPES ---------------- */

interface VerifyTokenResponse {
  error_status: boolean;
  code: string;
  message: string;
  data?: any;
}

interface AuthState {
  loading: boolean;
  data: any | null;
  error: string | null;
}

/* ---------------- INITIAL STATE ---------------- */

const initialState: AuthState = {
  loading: false,
  data: null,
  error: null,
};

/* ---------------- THUNK ---------------- */

export const verifyTokenApi = createAsyncThunk<
  VerifyTokenResponse,
  string,
  { rejectValue: string }
>(
  "auth/verifyToken",
  async (accessToken, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post<VerifyTokenResponse>(
        "/users/authenticateAccessToken",
        { accessToken }
      );

      if (data?.error_status) {
        return rejectWithValue(data.message || "Invalid or expired token");
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.message ||
        "Network error"
      );
    }
  }
);

/* ---------------- SLICE ---------------- */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* VERIFY TOKEN */
      .addCase(verifyTokenApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyTokenApi.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(verifyTokenApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Token verification failed";
      });
  },
});

/* ---------------- EXPORTS ---------------- */

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
