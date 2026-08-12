import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const { data } = await axios.get('/cart');
  return data.cart;
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, qty = 1 }) => {
  const { data } = await axios.post('/cart/items', { productId, qty });
  return data.cart;
});

export const updateQty = createAsyncThunk('cart/updateQty', async ({ itemId, qty }) => {
  const { data } = await axios.patch(`/cart/items/${itemId}`, { qty });
  return data.cart;
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (itemId) => {
  const { data } = await axios.delete(`/cart/items/${itemId}`);
  return data.cart;
});

export const toggleSaveForLater = createAsyncThunk('cart/toggleSaveForLater', async (itemId) => {
  const { data } = await axios.patch(`/cart/items/${itemId}/save-for-later`);
  return data.cart;
});

export const clearCart = createAsyncThunk('cart/clearCart', async () => {
  const { data } = await axios.delete('/cart');
  return data.cart;
});

const initialState = {
  items: [], // { _id, product, name, price, image, qty, savedForLater }
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const setCart = (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
    };
    const setLoading = (state) => {
      state.loading = true;
      state.error = null;
    };
    const setError = (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    };

    builder
      .addCase(fetchCart.pending, setLoading)
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(fetchCart.rejected, setError)
      .addCase(addToCart.fulfilled, setCart)
      .addCase(updateQty.fulfilled, setCart)
      .addCase(removeFromCart.fulfilled, setCart)
      .addCase(toggleSaveForLater.fulfilled, setCart)
      .addCase(clearCart.fulfilled, setCart);
  },
});

export default cartSlice.reducer;