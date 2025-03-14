import { createSlice } from "@reduxjs/toolkit";

const freeTrialSlice = createSlice({
    name: "freeTrial",
    initialState: {
        free:false
    },
    reducers: {
        setFree: (state, action) => {
            state.free = action.payload;
        }
    }
})
export const { setFree } = freeTrialSlice.actions;
export default freeTrialSlice.reducer;