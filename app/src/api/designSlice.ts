// src/features/design/designSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from ".";
import type { RootState } from "../redux/store";

export interface Design {
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

interface DesignPageResponse {
  designs: Design[];
  currentPage: number;
  totalPages: number;
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
export const fetchDesignList = createAsyncThunk<
  DesignPageResponse,
  { page?: number; size?: number },
  { state: RootState; rejectValue: string }
>(
  "designs/fetchHome",
  async (
    {
      page = 0,
      size = 10,
    }: {
      page?: number;
      size?: number;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const pt = getState().productType.selected;
      if (!pt) {
        throw new Error("Select a product type before loading products.");
      }
      const res = await api.get("designs", { params: { page, size, pt } });

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
export const fetchFilteredDesigns = createAsyncThunk<
  DesignPageResponse,
  {
    page?: number;
    size?: number;
    category?: number;
    subCategory?: number;
    weightRangeStart?: number;
    weightRangeEnd?: number;
    searchQuery?: string;
  },
  { state: RootState; rejectValue: string }
>(
  "designs/fetchFiltered",
  async (
    {
      page = 0,
      size = 10,
      category,
      subCategory,
      weightRangeStart,
      weightRangeEnd,
      searchQuery
    }: {
      page?: number;
      size?: number;
      category?: number;
      subCategory?: number;
      weightRangeStart?: number;
      weightRangeEnd?: number;
      searchQuery?: string;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const pt = getState().productType.selected;
      if (!pt) {
        throw new Error("Select a product type before loading products.");
      }
      const params: Record<string, string | number> = { page, size, pt };
      if (category !== undefined) params.category = category;
      if (subCategory !== undefined) params.subCategory = subCategory;
      if (weightRangeStart !== undefined) params.weightRangeStart = weightRangeStart;
      if (weightRangeEnd !== undefined) params.weightRangeEnd = weightRangeEnd;
      if (searchQuery) params.searchQuery = searchQuery;

      const res = await api.get("designs", { params });

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
    clearDesigns: () => initialState,
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

export const { clearDesigns, clearFilteredDesigns } = designSlice.actions;
export default designSlice.reducer;