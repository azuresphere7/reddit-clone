import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/redux";
import type { User } from "@/utils/interface";

const initialState: User = {
  id: "",
  name: "",
  email: "",
  imageUrl: "",
};

// Redux slice for storing user info
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state: User, action: PayloadAction<User>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const getUserState = (state: RootState) => state.user;
export const { addUser } = userSlice.actions;
export default userSlice.reducer;
