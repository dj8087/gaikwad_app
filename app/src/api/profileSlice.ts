import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import api from ".";

interface ProfileUser {
  name?: string | null;
  firmName?: string | null;
  mobile?: string | number | null;
  city?: string | null;
  erpCustomerId?: string | number | null;
  lastVisited?: string | null;
}

interface ProfileResponse {
  error_status?: boolean;
  message?: string;
  data?: ProfileUser;
}

interface ProfileState {
  loading: boolean;
  data: ProfileResponse | null;
  error: string | null;
}

const initialState: ProfileState = {
  loading: false,
  data: null,
  error: null,
};

export const getLoggedInUser = createAsyncThunk<
  ProfileResponse,
  void,
  { rejectValue: string }
>("profile/getLoggedInUser", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<ProfileResponse>("users/loggedInUser");
    if (response.data.error_status) {
      return rejectWithValue(response.data.message || "Unable to load profile.");
    }
    return response.data;
  } catch (error) {
    if (isAxiosError<ProfileResponse>(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to load profile. Please try again."
      );
    }
    return rejectWithValue(
      error instanceof Error ? error.message : "Unable to load profile. Please try again."
    );
  }
});

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
        state.error = action.payload ?? "Unable to load profile.";
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
