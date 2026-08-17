import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchCustomers = createAsyncThunk(
  'adminCustomers/fetchCustomers',
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const response = await API.get('/users', { params: queryParams });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customers');
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  'adminCustomers/fetchCustomerById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer');
    }
  }
);

const adminCustomersSlice = createSlice({
  name: 'adminCustomers',
  initialState: {
    items: [],
    totalUsers: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,

    selectedCustomer: null,
    selectedOrders: [],
    selectedOrderCount: 0,
    selectedTotalSpent: 0,
    detailLoading: false,
    detailError: null,
  },
  reducers: {
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
      state.selectedOrders = [];
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.users;
        state.totalUsers = action.payload.totalUsers;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCustomerById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedCustomer = action.payload.user;
        state.selectedOrders = action.payload.orders;
        state.selectedOrderCount = action.payload.orderCount;
        state.selectedTotalSpent = action.payload.totalSpent;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      });
  },
});

export const { clearSelectedCustomer } = adminCustomersSlice.actions;
export default adminCustomersSlice.reducer;