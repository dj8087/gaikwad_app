// src/redux/slices/productInquirySlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from ".";

interface InquiryPayload {
  siteVisitorId: number;
  siteProductDesignId: number;
  productCode: string;
}

interface InquiryState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: InquiryState = {
  loading: false,
  success: false,
  error: null,
};
interface InquiryPayload {
  siteVisitorId: number;
  siteProductDesignId: number;
  productCode: string;
  token: string;
  inquiryMsg?: string;
}

export const createProductInquiry = createAsyncThunk(
  "productInquiry/create",
  async (payload: InquiryPayload, { rejectWithValue }) => {
    try {
      const { token, ...body } = payload;

      const res = await axiosClient.post(
        "/product-inquiries",
        body,
        {
          headers: {
            token: token, 
          },
        }
      );

      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Inquiry failed"
      );
    }
  }
);

const productInquirySlice = createSlice({
  name: "productInquiry",
  initialState,
  reducers: {
    resetInquiryState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProductInquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductInquiry.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createProductInquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetInquiryState } = productInquirySlice.actions;
export default productInquirySlice.reducer;
