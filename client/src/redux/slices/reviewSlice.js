import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchProductReviews = createAsyncThunk(
  'reviews/fetchProductReviews',
  async ({ productId, page = 1, sort = 'newest' }, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/reviews/product/${productId}`, {
        params: { page, sort },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load reviews');
    }
  }
);

export const fetchMyReview = createAsyncThunk(
  'reviews/fetchMyReview',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/reviews/product/${productId}/mine`);
      return data.review;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load your review');
    }
  }
);

// formData built by ReviewForm — rating/title/comment/images, plus
// productId appended by ReviewsSection before dispatch.
export const submitReview = createAsyncThunk(
  'reviews/submitReview',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/reviews', formData);
      return data.review;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit review');
    }
  }
);

export const editReview = createAsyncThunk(
  'reviews/editReview',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/reviews/${id}`, formData);
      return data.review;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update review');
    }
  }
);

export const removeReview = createAsyncThunk(
  'reviews/removeReview',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/reviews/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

export const toggleLikeReview = createAsyncThunk(
  'reviews/toggleLikeReview',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.patch(`/reviews/${id}/like`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like review');
    }
  }
);

export const reportReview = createAsyncThunk(
  'reviews/reportReview',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/reviews/${id}/report`, { reason });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to report review');
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    items: [],
    totalReviews: 0,
    currentPage: 1,
    totalPages: 1,
    summary: { averageRating: 0, totalReviews: 0 },
    loading: false,
    error: null,

    myReview: null,
    myReviewLoading: false,

    actionLoading: false,
    actionError: null,
  },
  reducers: {
    clearReviewActionError(state) {
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.reviews;
        state.totalReviews = action.payload.totalReviews;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.summary = action.payload.summary;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMyReview.pending, (state) => {
        state.myReviewLoading = true;
      })
      .addCase(fetchMyReview.fulfilled, (state, action) => {
        state.myReviewLoading = false;
        state.myReview = action.payload;
      })
      .addCase(fetchMyReview.rejected, (state) => {
        state.myReviewLoading = false;
      })

      .addCase(submitReview.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.myReview = action.payload;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      .addCase(editReview.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(editReview.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.myReview = action.payload;
      })
      .addCase(editReview.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      .addCase(removeReview.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r._id !== action.payload);
        if (state.myReview && state.myReview._id === action.payload) {
          state.myReview = null;
        }
      })

      .addCase(toggleLikeReview.fulfilled, (state, action) => {
        const { reviewId, likeCount } = action.payload;
        const review = state.items.find((r) => r._id === reviewId);
        if (review) review.likeCount = likeCount;
      })

      .addCase(reportReview.fulfilled, (state, action) => {
        const { reviewId, reportCount } = action.payload;
        const review = state.items.find((r) => r._id === reviewId);
        if (review) review.reportCount = reportCount;
      });
  },
});

export const { clearReviewActionError } = reviewSlice.actions;
export default reviewSlice.reducer;