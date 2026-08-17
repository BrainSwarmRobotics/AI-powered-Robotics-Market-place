import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchCoupons = createAsyncThunk(
  'adminCoupons/fetchCoupons',
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/coupons', { params: queryParams });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch coupons');
    }
  }
);

export const createCoupon = createAsyncThunk(
  'adminCoupons/createCoupon',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/coupons', payload);
      return data.coupon;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create coupon');
    }
  }
);

export const updateCoupon = createAsyncThunk(
  'adminCoupons/updateCoupon',
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/coupons/${id}`, payload);
      return data.coupon;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update coupon');
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  'adminCoupons/deleteCoupon',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/coupons/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete coupon');
    }
  }
);

const adminCouponsSlice = createSlice({
  name: 'adminCoupons',
  initialState: {
    items: [],
    totalCoupons: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    formLoading: false,
    formError: null,
  },
  reducers: {
    clearCouponFormError(state) {
      state.formError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.coupons;
        state.totalCoupons = action.payload.totalCoupons;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCoupon.pending, (state) => {
        state.formLoading = true;
        state.formError = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.formLoading = false;
        state.items.unshift(action.payload);
        state.totalCoupons += 1;
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.formLoading = false;
        state.formError = action.payload;
      })
      .addCase(updateCoupon.pending, (state) => {
        state.formLoading = true;
        state.formError = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.formLoading = false;
        const idx = state.items.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.formLoading = false;
        state.formError = action.payload;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload);
        state.totalCoupons = Math.max(0, state.totalCoupons - 1);
      });
  },
});

export const { clearCouponFormError } = adminCouponsSlice.actions;
export default adminCouponsSlice.reducer;