import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchAnalyticsSummary = createAsyncThunk(
  'adminAnalytics/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/analytics/summary');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch summary');
    }
  }
);

export const fetchSalesAnalytics = createAsyncThunk(
  'adminAnalytics/fetchSales',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/analytics/sales', { params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sales data');
    }
  }
);

export const fetchTopProducts = createAsyncThunk(
  'adminAnalytics/fetchTopProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/analytics/top-products', { params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch top products');
    }
  }
);

const adminAnalyticsSlice = createSlice({
  name: 'adminAnalytics',
  initialState: {
    summary: null,
    summaryLoading: false,
    summaryError: null,

    period: 'daily',
    salesData: [],
    salesLoading: false,
    salesError: null,

    topProductsSortBy: 'revenue',
    topProducts: [],
    topProductsLoading: false,
    topProductsError: null,
  },
  reducers: {
    setAnalyticsPeriod(state, action) {
      state.period = action.payload;
    },
    setTopProductsSortBy(state, action) {
      state.topProductsSortBy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsSummary.pending, (state) => {
        state.summaryLoading = true;
        state.summaryError = null;
      })
      .addCase(fetchAnalyticsSummary.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchAnalyticsSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.summaryError = action.payload;
      })
      .addCase(fetchSalesAnalytics.pending, (state) => {
        state.salesLoading = true;
        state.salesError = null;
      })
      .addCase(fetchSalesAnalytics.fulfilled, (state, action) => {
        state.salesLoading = false;
        state.salesData = action.payload.data;
      })
      .addCase(fetchSalesAnalytics.rejected, (state, action) => {
        state.salesLoading = false;
        state.salesError = action.payload;
      })
      .addCase(fetchTopProducts.pending, (state) => {
        state.topProductsLoading = true;
        state.topProductsError = null;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.topProductsLoading = false;
        state.topProducts = action.payload.products;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.topProductsLoading = false;
        state.topProductsError = action.payload;
      });
  },
});

export const { setAnalyticsPeriod, setTopProductsSortBy } = adminAnalyticsSlice.actions;
export default adminAnalyticsSlice.reducer;