import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (shippingAddress, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/orders', { shippingAddress });
      return data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to place order');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/orders/mine');
      return data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    lastOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearLastOrder(state) {
      state.lastOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.lastOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLastOrder } = orderSlice.actions;
export default orderSlice.reducer;
