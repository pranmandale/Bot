
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import tokenReducer from "../features/auth/tokenSlice.js";
import userReducer from "../features/auth/userSlice.js";

const rootReducer = {
    auth: authReducer,
    token: tokenReducer,
    user: userReducer,
};


export const store = configureStore({
    reducer: rootReducer,
    middleware : (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }), 
});

export default store;