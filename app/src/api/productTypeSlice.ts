import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ProductType = "TJ" | "KT";

interface ProductTypeState {
  selected: ProductType | null;
}

const initialState: ProductTypeState = {
  selected: null,
};

const productTypeSlice = createSlice({
  name: "productType",
  initialState,
  reducers: {
    setProductType: (state, action: PayloadAction<ProductType>) => {
      state.selected = action.payload;
    },
  },
});

export const { setProductType } = productTypeSlice.actions;
export default productTypeSlice.reducer;
