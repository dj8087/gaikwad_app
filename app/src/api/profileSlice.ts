// src/features/Profile/profileSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from ".";

export const getLoggedInUser = createAsyncThunk(
  "profile/getLoggedInUser",
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await api.get("users/loggedInUser", {
        headers: {
          token: token
        },
      });

      return res.data;
    } catch (error: any) {
      return error.data
    }
  }
);

const initialState = {
  loading: false,
  data: null as any,
  error: null as string | null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLoggedInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLoggedInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getLoggedInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
