
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from ".";

// -------------------- MODELS --------------------
interface SubCategory {
  id: number;
  name: string;
  nameMr: string;
  productCount?: number;
}

interface Category {
  id: number;
  name: string;
  nameMr: string;
  iconSelector: string;
  subCat?: SubCategory[];
}

interface CategoryState {
  loading: boolean;
  categories: Category[];
  error: string | null;
}

const initialState: CategoryState = {
  loading: false,
  categories: [],
  error: null,
};

// -------------------- THUNK --------------------
export const fetchCategories = createAsyncThunk(
  "categories/fetch",
  async ({ token }: { token: string }, { rejectWithValue }) => {
    try {
      const url = "/categories";
      console.log("Fetching categories from:", api.defaults.baseURL + url);
      const res = await api.get(url, {
        headers: { token },
      });
      return res.data?.data || [];
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ??
        error?.message ??
        "Failed to fetch categories";
      return rejectWithValue(msg);
    }
  }
);

// -------------------- SLICE --------------------
const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default categorySlice.reducer;
