import { createSlice } from "@reduxjs/toolkit";
const storedUser = JSON.parse(localStorage.getItem("user")) || null;
export const userSlice = createSlice({
    name: 'user',
    initialState: storedUser,
    reducers: {
        addUser: (state, action) => {
            localStorage.setItem("user", JSON.stringify(action.payload)); 
            return action.payload;
        },
        removeUser: () => {
            localStorage.removeItem("user"); 
            return null;
        }
    }
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;