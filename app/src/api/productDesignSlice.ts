import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from ".";

export interface ProductDesignVariant {
  id: number;
  siteProductDesignId: number;
  weight: number;
  wax: boolean;
  carat: number;
  stock: boolean;
  sampleBarcode : any
}

export interface DesignDetail {
  id: number;
  name: string;
  nameMr: string;
  productionRangeStart: number;
  productionRangeEnd: number;
  inStock: boolean;
  thumbnailSelector: string;
  categoryId: number;
  subCategoryId: number;
  isHidden: boolean;
}

interface ProductDesignState {
  designsByProductId: Record<string, Record<string, ProductDesignVariant>>;
  currentDesignDetail: DesignDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductDesignState = {
  designsByProductId: {},
  currentDesignDetail: null,
  loading: false,
  error: null,
};

export const fetchProductDesigns = createAsyncThunk(
  "productDesign/fetch",
  async (
    { productId, token }: { productId: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get(`site/product-designs/${productId}/images`, { headers: { token: token } });
      return {
        productId,
        designs: res.data,
      };
    } catch (e: any) {
      return rejectWithValue(e.message || "Failed to fetch product designs");
    }
  }
);

export const fetchDesignDetails = createAsyncThunk(
  "productDesign/fetchDetails",
  async (
    { productId, token }: { productId: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get(`/designs/${productId}`, { headers: { token } });
      return res.data.data as DesignDetail;
    } catch (e: any) {
      return rejectWithValue(e.message || "Failed to fetch design details");
    }
  }
);

const productDesignSlice = createSlice({
  name: "productDesign",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDesigns.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductDesigns.fulfilled, (state, action) => {
        state.loading = false;
        state.designsByProductId =
          action.payload.designs;
      })
      .addCase(fetchProductDesigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDesignDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDesignDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDesignDetail = action.payload;
      })
      .addCase(fetchDesignDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productDesignSlice.reducer;
