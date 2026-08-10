import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // { _id, name, price, image, qty }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existing = state.items.find((i) => i._id === product._id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url || null,
          qty: 1,
        });
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i._id !== action.payload);
    },
    updateQty(state, action) {
      const { _id, qty } = action.payload;
      const item = state.items.find((i) => i._id === _id);
      if (item) item.qty = Math.max(1, qty);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
