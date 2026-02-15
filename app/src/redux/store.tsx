import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "../api/authSlice";
import designReducer from "../api/designSlice";
import { default as imageSelectoreReducer, default as imageSelectorSlice } from "../api/imageSelectorSlice";
import productDesignReducer from "../api/productDesignSlice";
import productInquiryReducer from "../api/productInquirySlice";
import profileReducer from "../api/profileSlice";
import vistorsReducer from "../api/visitorsSlice";

import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE,
} from "redux-persist";

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    whitelist: ["auth", "profile"],
};

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    designs: designReducer,
    imageSelector: imageSelectoreReducer,
    productDesignSelector: productDesignReducer,
    vistorsReducer: vistorsReducer,
    imageSelectorReducer: imageSelectorSlice,
    productInquiryReducer: productInquiryReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, PAUSE, REHYDRATE, PERSIST, REGISTER, PURGE],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
