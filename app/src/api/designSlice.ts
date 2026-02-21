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
  designs: Design[];          // 🔹 Home designs
  filteredDesigns: Design[];  // 🔹 Filter designs
  error: string | null;
  currentPage: number;
  totalPages: number;
  filterCurrentPage: number;
  filterTotalPages: number;
}

const initialState: DesignState = {
  loading: false,
  designs: [],
  filteredDesigns: [],
  error: null,
  currentPage: 0,
  totalPages: 0,
  filterCurrentPage: 0,
  filterTotalPages: 0,
};



// ============================
// 🔵 HOME DESIGNS THUNK
// ============================
export const fetchDesignList = createAsyncThunk(
  "designs/fetchHome",
  async (
    {
      token,
      page = 0,
      size = 10,
    }: {
      token: string;
      page?: number;
      size?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const url = `designs?page=${page}&size=${size}`;

      const res = await api.get(url, {
        headers: { token },
      });

      return res.data?.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ??
        error?.message ??
        "Failed to fetch designs"
      );
    }
  }
);



// ============================
// 🟡 FILTER DESIGNS THUNK
// ============================
export const fetchFilteredDesigns = createAsyncThunk(
  "designs/fetchFiltered",
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

      if (category) url += `&category=${category}`;
      if (subCategory) url += `&subCategory=${subCategory}`;
      if (weightRangeStart) url += `&weightRangeStart=${weightRangeStart}`;
      if (weightRangeEnd) url += `&weightRangeEnd=${weightRangeEnd}`;

      const res = await api.get(url, {
        headers: { token },
      });

      return res.data?.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ??
        error?.message ??
        "Failed to fetch filtered designs"
      );
    }
  }
);

const designSlice = createSlice({
  name: "designs",
  initialState,
  reducers: {
    clearFilteredDesigns: (state) => {
      state.filteredDesigns = [];
      state.filterCurrentPage = 0;
      state.filterTotalPages = 0;
    },
  },
  extraReducers: (builder) => {
    builder

      // ===== HOME =====
      .addCase(fetchDesignList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesignList.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.currentPage === 0) {
          state.designs = action.payload.designs;
        } else {
          state.designs = [
            ...state.designs,
            ...action.payload.designs,
          ];
        }

        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })


      // ===== FILTER =====
      .addCase(fetchFilteredDesigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredDesigns.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.currentPage === 0) {
          state.filteredDesigns = action.payload.designs;
        } else {
          state.filteredDesigns = [
            ...state.filteredDesigns,
            ...action.payload.designs,
          ];
        }

        state.filterCurrentPage = action.payload.currentPage;
        state.filterTotalPages = action.payload.totalPages;
      })


      .addCase(fetchDesignList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFilteredDesigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearFilteredDesigns } = designSlice.actions;
export default designSlice.reducer;