import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import api from ".";

interface InquiryPayload {
  siteProductDesignId: number;
  inquiryMsg?: string;
  imageId: number;
}

interface InquiryResponse {
  code?: number | string;
  message?: string;
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

export const createProductInquiry = createAsyncThunk<
  InquiryResponse,
  InquiryPayload,
  { rejectValue: string }
>("productInquiry/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<InquiryResponse>("product-inquiries", payload);
    if (String(response.data.code) !== "200") {
      return rejectWithValue(response.data.message || "Unable to submit inquiry.");
    }
    return response.data;
  } catch (error) {
    if (isAxiosError<InquiryResponse>(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to submit inquiry. Please try again."
      );
    }
    return rejectWithValue(
      error instanceof Error ? error.message : "Unable to submit inquiry. Please try again."
    );
  }
});

const productInquirySlice = createSlice({
  name: "productInquiry",
  initialState,
  reducers: {
    resetInquiryState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProductInquiry.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createProductInquiry.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createProductInquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unable to submit inquiry.";
      });
  },
});

export const { resetInquiryState } = productInquirySlice.actions;
export default productInquirySlice.reducer;
