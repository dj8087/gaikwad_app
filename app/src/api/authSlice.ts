import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import { isAxiosError } from "axios";
import api, { setCustomerToken as setApiCustomerToken } from ".";

export const CUSTOMER_TOKEN_KEY = "aj_gold_customer_token";

interface AuthenticationResponse {
  error_status: boolean;
  message?: string;
  data?: {
    success?: boolean;
    message?: string;
    customerToken?: string;
  };
}

interface AuthState {
  customerToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  customerToken: null,
  loading: false,
  error: null,
};

export const authenticateAccessCode = createAsyncThunk<
  string,
  { accessCode: string; fcmToken?: string | null },
  { rejectValue: string }
>("auth/authenticateAccessCode", async ({ accessCode, fcmToken }, { rejectWithValue }) => {
  try {
    const response = await api.post<AuthenticationResponse>(
      "users/authenticateAccessToken",
      { accessToken: accessCode, fcmToken }
    );
    const result = response.data;
    const customerToken = result.data?.customerToken;

    if (result.error_status || result.data?.success !== true || !customerToken) {
      return rejectWithValue(
        result.data?.message || result.message || "The access code could not be verified."
      );
    }

    await SecureStore.setItemAsync(CUSTOMER_TOKEN_KEY, customerToken);
    return customerToken;
  } catch (error) {
    if (isAxiosError<AuthenticationResponse>(error)) {
      return rejectWithValue(
        error.response?.data?.data?.message ||
          error.response?.data?.message ||
          "Unable to verify the access code. Please check your connection and try again."
      );
    }

    return rejectWithValue(
      error instanceof Error
        ? error.message
        : "Unable to save catalogue access on this device."
    );
  }
});

export const logoutCustomer = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/logoutCustomer", async (_, { rejectWithValue }) => {
  try {
    await SecureStore.deleteItemAsync(CUSTOMER_TOKEN_KEY);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unable to clear saved catalogue access."
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    restoreCustomerToken: (state, action: PayloadAction<string>) => {
      state.customerToken = action.payload;
      setApiCustomerToken(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateAccessCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateAccessCode.fulfilled, (state, action) => {
        state.loading = false;
        state.customerToken = action.payload;
        setApiCustomerToken(action.payload);
      })
      .addCase(authenticateAccessCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unable to verify the access code.";
      })
      .addCase(logoutCustomer.fulfilled, (state) => {
        state.customerToken = null;
        state.loading = false;
        state.error = null;
        setApiCustomerToken(null);
      });
  },
});

export const { restoreCustomerToken } = authSlice.actions;
export default authSlice.reducer;
