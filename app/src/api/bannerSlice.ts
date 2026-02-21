import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from ".";

// -------------------- STATE MODEL --------------------
interface BannerState {
    loading: boolean;
    banners: string[];
    error: string | null;
}

const initialState: BannerState = {
    loading: false,
    banners: [],
    error: null,
};

// -------------------- THUNK --------------------
export const fetchBanners = createAsyncThunk(
    "banners/fetch",
    async ({ token }: { token: string }, { rejectWithValue }) => {
        try {
            const url = "/images/banners";
            const res = await api.get(url, {
                headers: { token },
            });

            return res.data || [];
        } catch (error: any) {
            const msg =
                error?.response?.data?.message ??
                error?.message ??
                "Failed to fetch banners";

            return rejectWithValue(msg);
        }
    }
);

// -------------------- SLICE --------------------
const bannerSlice = createSlice({
    name: "banners",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBanners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBanners.fulfilled, (state, action: PayloadAction<string[]>) => {
                state.loading = false;
                state.banners = action.payload;
            })
            .addCase(fetchBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default bannerSlice.reducer;