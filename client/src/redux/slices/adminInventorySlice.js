import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchInventoryStatus = createAsyncThunk(
  'adminInventory/fetchInventoryStatus',
  async (threshold, { rejectWithValue }) => {
    try {
      const response = await API.get('/products/admin/inventory', {
        params: threshold ? { threshold } : {},
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory status');
    }
  }
);

const adminInventorySlice = createSlice({
  name: 'adminInventory',
  initialState: {
    threshold: 5,
    outOfStock: [],
    lowStock: [],
    outOfStockCount: 0,
    lowStockCount: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.threshold = action.payload.threshold;
        state.outOfStock = action.payload.outOfStock;
        state.lowStock = action.payload.lowStock;
        state.outOfStockCount = action.payload.outOfStockCount;
        state.lowStockCount = action.payload.lowStockCount;
      })
      .addCase(fetchInventoryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminInventorySlice.reducer;