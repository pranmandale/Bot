import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from "../../services/axiosInstance.js"


const initialState = {
    user : null,
    loading: false,
    error: null,
    
}


export const fetchUser = createAsyncThunk(
    'auth/fetchUser',
    async (_, {rejectWithValue, dispatch}) => {
        try {
            const response = await axiosInstance.get(`/auth/profile`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.log("error fetching user", error);
            return rejectWithValue(error.response?.data || {message: "Server error"});
        }       
    }
);




const userSlice = createSlice({
    name: "user",
    initialState,
    extraReducers: (builder) => {
        builder
        .addCase(fetchUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUser.fulfilled, (state, action) => {
            state.user = action.payload.user || null;
            state.loading = false;
        })
        .addCase(fetchUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        })    
        
    }
})

export default userSlice.reducer;