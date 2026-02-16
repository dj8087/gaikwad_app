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
  currentPage: number;
  totalPages: number;
}

const initialState: DesignState = {
  loading: false,
  designs: [],
  error: null,
  currentPage: 0,
  totalPages: 0,
};

// -------------------- THUNK --------------------
export const fetchDesignList = createAsyncThunk(
  "designs/fetch",
  async (
    {
      token,
      page = 0,
      size = 10,
      category,
      subCategory,
      weightRangeStart,
      weightRangeEnd,
    }: {
      token: string;
      page?: number;
      size?: number;
      category?: number;
      subCategory?: number;
      weightRangeStart?: number;
      weightRangeEnd?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      let url = `designs?page=${page}&size=${size}`;
      if (category) {
        url += `&category=${category}`;
      }
      if (subCategory) {
        url += `&subCategory=${subCategory}`;
      }
      if (weightRangeStart) {
        url += `&weightRangeStart=${weightRangeStart}`;
      }
      if (weightRangeEnd) {
        url += `&weightRangeEnd=${weightRangeEnd}`;
      }
      const res = await api.get(url, {
        headers: { token },
      });

      return res.data?.data || { designs: [], currentPage: 0, totalPages: 0 };
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
        if (action.payload.currentPage === 0) {
          state.designs = action.payload.designs;
        } else {
          state.designs = [...state.designs, ...action.payload.designs];
        }
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchDesignList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default designSlice.reducer;
