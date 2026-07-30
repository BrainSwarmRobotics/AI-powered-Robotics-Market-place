import { createSlice } from '@reduxjs/toolkit';

const loadWishlist = () => {
  try {
    const data = localStorage.getItem('wishlist');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: loadWishlist(),
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const exists = state.items.find((p) => p._id === action.payload._id);
      if (exists) {
        state.items = state.items.filter((p) => p._id !== action.payload._id);
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((p) => p._id !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
  },
});

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;