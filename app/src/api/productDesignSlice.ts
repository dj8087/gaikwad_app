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

interface ProductDesignState {
  designsByProductId: Record<string, Record<string, ProductDesignVariant>>;
  loading: boolean;
  error: string | null;
}

const initialState: ProductDesignState = {
  designsByProductId: {},
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
      });
  },
});

export default productDesignSlice.reducer;
