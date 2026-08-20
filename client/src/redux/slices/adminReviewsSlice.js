import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchAdminReviews = createAsyncThunk(
  'adminReviews/fetchAdminReviews',
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/reviews/admin', { params: queryParams });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const moderateAdminReview = createAsyncThunk(
  'adminReviews/moderateAdminReview',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await API.patch(`/reviews/admin/${id}/status`, { status });
      return data.review;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update review status');
    }
  }
);

export const deleteAdminReview = createAsyncThunk(
  'adminReviews/deleteAdminReview',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/reviews/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

const adminReviewsSlice = createSlice({
  name: 'adminReviews',
  initialState: {
    items: [],
    totalReviews: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    actionLoading: false,
    actionError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.reviews;
        state.totalReviews = action.payload.totalReviews;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAdminReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(moderateAdminReview.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(moderateAdminReview.fulfilled, (state, action) => {
        state.actionLoading = false;
        const idx = state.items.findIndex((r) => r._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(moderateAdminReview.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })
      .addCase(deleteAdminReview.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r._id !== action.payload);
        state.totalReviews = Math.max(0, state.totalReviews - 1);
      });
  },
});

export default adminReviewsSlice.reducer;