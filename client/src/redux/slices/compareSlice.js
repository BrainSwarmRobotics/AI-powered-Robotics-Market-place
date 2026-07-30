import { createSlice } from "@reduxjs/toolkit";

const MAX_COMPARE = 3;

const compareSlice = createSlice({
  name: "compare",
  initialState: {
    items: [], // array of full product objects, max 3
    limitMessage: "", // feedback when user hits the cap
  },
  reducers: {
    toggleCompare: (state, action) => {
      const exists = state.items.find((p) => p._id === action.payload._id);

      if (exists) {
        state.items = state.items.filter((p) => p._id !== action.payload._id);
        state.limitMessage = "";
        return;
      }

      if (state.items.length >= MAX_COMPARE) {
        state.limitMessage = `You can only compare up to ${MAX_COMPARE} products. Remove one first.`;
        return;
      }

      state.items.push(action.payload);
      state.limitMessage = "";
    },
    clearCompare: (state) => {
      state.items = [];
      state.limitMessage = "";
    },
  },
});

export const { toggleCompare, clearCompare } = compareSlice.actions;
export default compareSlice.reducer;