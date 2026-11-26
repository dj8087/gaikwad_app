import { combineReducers, configureStore } from "@reduxjs/toolkit";

import designReducer from "../api/designSlice";
import imageSelectorReducer from "../api/imageSelectorSlice";
import productDesignReducer from "../api/productDesignSlice";
import bannerReducer from "../api/bannerSlice";

import categoryReducer from "../api/categorySlice";
import authReducer from "../api/authSlice";
import profileReducer from "../api/profileSlice";
import productTypeReducer from "../api/productTypeSlice";
import productInquiryReducer from "../api/productInquirySlice";

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    designs: designReducer,
    imageSelector: imageSelectorReducer,
    productDesignSelector: productDesignReducer,
    category: categoryReducer,
    banner: bannerReducer,
    productType: productTypeReducer,
    productInquiry: productInquiryReducer,
});

export const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
