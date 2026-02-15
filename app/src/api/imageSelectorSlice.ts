import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Buffer } from "buffer";
import api from ".";

interface ImageSelectorState {
  loading: boolean;
  images: Record<string, string>;
  error: string | null;
}

const initialState: ImageSelectorState = {
  loading: false,
  images: {},
  error: null,
};


export const fetchImageSelector = createAsyncThunk(
  "imageSelector/fetch",
  async (
    { selector, token }: { selector: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get(
        `images/imageSelectors/${selector}.jpg`,
        {
          headers: { token },
          responseType: "arraybuffer",
        }
      );

      const base64 =
        "data:image/jpeg;base64," +
        Buffer.from(res.data, "binary").toString("base64");

      return {
        selector,
        image: base64,
      };
    } catch (error) {
      return rejectWithValue(selector);
    }
  }
);


const imageSelectorSlice = createSlice({
  name: "imageSelector",
  initialState,
  reducers: {
    clearImages: (state) => {
      state.images = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImageSelector.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImageSelector.fulfilled, (state, action) => {
        state.loading = false;
        state.images[action.payload.selector] = action.payload.image;
      })
      .addCase(fetchImageSelector.rejected, (state, action) => {
        state.loading = false;
        state.error = `Image not available for ${action.payload}`;
      });
  },
});

export const { clearImages } = imageSelectorSlice.actions;
export default imageSelectorSlice.reducer;
