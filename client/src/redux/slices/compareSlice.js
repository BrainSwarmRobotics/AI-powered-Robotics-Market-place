import { createSlice } from '@reduxjs/toolkit';

const MAX_COMPARE = 3;

const loadCompare = () => {
  try {
    const data = localStorage.getItem('compare');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

const compareSlice = createSlice({
  name: 'compare',
  initialState: {
    items: loadCompare(),
    limitMessage: '',
  },
  reducers: {
    toggleCompare: (state, action) => {
      const exists = state.items.find((p) => p._id === action.payload._id);
      if (exists) {
        state.items = state.items.filter((p) => p._id !== action.payload._id);
        state.limitMessage = '';
        localStorage.setItem('compare', JSON.stringify(state.items));
        return;
      }
      if (state.items.length >= MAX_COMPARE) {
        state.limitMessage = `You can only compare up to ${MAX_COMPARE} products. Remove one first.`;
        return;
      }
      state.items.push(action.payload);
      state.limitMessage = '';
      localStorage.setItem('compare', JSON.stringify(state.items));
    },
    clearCompare: (state) => {
      state.items = [];
      state.limitMessage = '';
      localStorage.setItem('compare', JSON.stringify(state.items));
    },
    clearLimitMessage: (state) => {
      state.limitMessage = '';
    },
  },
});

export const { toggleCompare, clearCompare, clearLimitMessage } = compareSlice.actions;
export default compareSlice.reducer;