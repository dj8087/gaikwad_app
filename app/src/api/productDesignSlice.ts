import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from ".";
import type { RootState } from "../redux/store";

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
}

interface ProductDesignResponse {
  data?: Record<string, ProductDesignVariant>;
}

interface ProductDesignState {
  designsByProductId: ProductDesignResponse | null;
  currentDesignDetail: DesignDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductDesignState = {
  designsByProductId: null,
  currentDesignDetail: null,
  loading: false,
  error: null,
};

export const fetchProductDesigns = createAsyncThunk<
  { productId: string; designs: ProductDesignResponse },
  { productId: string },
  { state: RootState; rejectValue: string }
>(
  "productDesign/fetch",
  async (
    { productId }: { productId: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const pt = getState().productType.selected;
      if (!pt) {
        throw new Error("Select a product type before loading product details.");
      }
      const res = await api.get(`site/product-designs/${productId}/images`, {
        params: { pt },
      });
      return {
        productId,
        designs: res.data,
      };
    } catch (e: any) {
      return rejectWithValue(e.message || "Failed to fetch product designs");
    }
  }
);

export const fetchDesignDetails = createAsyncThunk<
  DesignDetail,
  { productId: string },
  { state: RootState; rejectValue: string }
>(
  "productDesign/fetchDetails",
  async (
    { productId }: { productId: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const pt = getState().productType.selected;
      if (!pt) {
        throw new Error("Select a product type before loading product details.");
      }
      const res = await api.get(`/designs/${productId}`, { params: { pt } });
      return res.data.data as DesignDetail;
    } catch (e: any) {
      return rejectWithValue(e.message || "Failed to fetch design details");
    }
  }
);

const productDesignSlice = createSlice({
  name: "productDesign",
  initialState,
  reducers: {
    clearProductDesign: () => initialState,
  },
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

export const { clearProductDesign } = productDesignSlice.actions;
export default productDesignSlice.reducer;
