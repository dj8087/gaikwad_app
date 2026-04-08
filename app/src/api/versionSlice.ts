
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from ".";

/* ---------------- TYPES ---------------- */

interface VersionData {
    id: number;
    currentVersion: string;
    releaseNote: string;
    createdAt: string;
    isLatest: boolean;
    isForceUpdate: boolean;
}

interface VersionResponse {
  error_status: boolean;
  code: string;
  message: string;
  data: VersionData;
}

interface VersionState {
  loading: boolean;
  data: VersionData | null;
  error: string | null;
}

/* ---------------- INITIAL STATE ---------------- */

const initialState: VersionState = {
  loading: false,
  data: null,
  error: null,
};

/* ---------------- THUNK ---------------- */

export const getLatestVersionApi = createAsyncThunk<
  VersionResponse,
  { token: string | null },
  { rejectValue: string }
>(
  "version/getLatestVersion",
  async ({ token }, { rejectWithValue }) => {
    console.log("Fetching latest version from API...");
    if (!token) {
      console.error("No token provided");
      return rejectWithValue("No token provided");
    }
    try {
      const { data } = await axiosClient.get<VersionResponse>(
        "/app/versions/latest",
        {
          headers: { token },
        }
      );
      console.log("Latest version fetched successfully:", data);
      if (data?.error_status) {
        return rejectWithValue(data.message || "Failed to get latest version");
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

const versionSlice = createSlice({
  name: "version",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* GET LATEST VERSION */
      .addCase(getLatestVersionApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLatestVersionApi.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(getLatestVersionApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get latest version";
      });
  },
});

/* ---------------- EXPORTS ---------------- */

export default versionSlice.reducer;
