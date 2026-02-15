import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from ".";

interface VisitorsState {
    loading: boolean;
    data: any;
    error: string | null;
}


const initialState: VisitorsState = {
    loading: false,
    data: null,
    error: null,
};


export const postVisitor = createAsyncThunk(
    "visitors/post",
    async (
        {
            payload,
            token,
        }: {
            payload: any;
            token: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosClient.post(
                "/visitors",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        token: token,
                    },
                }
            );

            return res.data;
        } catch (err: any) {
            return rejectWithValue(
                err?.response?.data?.message ||
                "Invalid customer token"
            );
        }
    }
);


const visitorsSlice = createSlice({
    name: "visitors",
    initialState,
    reducers: {
        clearVisitorsState: (state) => {
            state.loading = false;
            state.data = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(postVisitor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postVisitor.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(postVisitor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearVisitorsState } = visitorsSlice.actions;
export default visitorsSlice.reducer;
