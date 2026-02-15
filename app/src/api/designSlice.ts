// src/features/design/designSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from ".";

interface Design {
  id: any;
  name: string;
  nameM?: string;
  productionRangeStart: any;
  productionRangeEnd: any;
  inStock: boolean;
  thumbnailSelector: string;
  categoryId: number;
  subCategoryId: number;
}

interface DesignState {
  loading: boolean;
  designs: Design[];
  error: string | null;
}

const initialState: DesignState = {
  loading: false,
  designs: [],
  error: null,
};

// -------------------- THUNK --------------------
export const fetchDesignList = createAsyncThunk(
  "designs/fetch",
  async (
    { token, resultPerPage = 20 }: { token: string; resultPerPage?: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get(
        `designs?resultPerPage=${resultPerPage}`,
        {
          headers: { token },
        }
      );

      return res.data?.data?.designs || [];
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ??
        error?.message ??
        "Failed to fetch designs";

      return rejectWithValue(msg);
    }
  }
);

// -------------------- SLICE --------------------
const designSlice = createSlice({
  name: "designs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesignList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesignList.fulfilled, (state, action) => {
        state.loading = false;
        state.designs = action.payload;
      })
      .addCase(fetchDesignList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default designSlice.reducer;
