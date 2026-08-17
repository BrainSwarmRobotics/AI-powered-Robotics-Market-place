import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchAdminOrders = createAsyncThunk(
  'adminOrders/fetchAdminOrders',
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/orders/admin', { params: queryParams });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchAdminOrderById = createAsyncThunk(
  'adminOrders/fetchAdminOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/orders/admin/${id}`);
      return data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const updateAdminOrderStatus = createAsyncThunk(
  'adminOrders/updateAdminOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await API.patch(`/orders/admin/${id}/status`, { status });
      return data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

export const updateAdminOrderRefund = createAsyncThunk(
  'adminOrders/updateAdminOrderRefund',
  async ({ id, status, reason }, { rejectWithValue }) => {
    try {
      const { data } = await API.patch(`/orders/admin/${id}/refund`, { status, reason });
      return data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update refund status');
    }
  }
);

const adminOrdersSlice = createSlice({
  name: 'adminOrders',
  initialState: {
    items: [],
    totalOrders: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    selectedOrder: null,
    detailLoading: false,
    detailError: null,
    actionLoading: false,
    actionError: null,
  },
  reducers: {
    clearSelectedAdminOrder(state) {
      state.selectedOrder = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.orders;
        state.totalOrders = action.payload.totalOrders;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminOrderById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchAdminOrderById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchAdminOrderById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      })
      .addCase(updateAdminOrderStatus.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateAdminOrderStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedOrder = action.payload;
        const idx = state.items.findIndex((o) => o._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateAdminOrderStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })
      .addCase(updateAdminOrderRefund.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateAdminOrderRefund.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedOrder = action.payload;
        const idx = state.items.findIndex((o) => o._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateAdminOrderRefund.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });
  },
});

export const { clearSelectedAdminOrder } = adminOrdersSlice.actions;
export default adminOrdersSlice.reducer;