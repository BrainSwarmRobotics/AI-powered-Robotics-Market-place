import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const createPaymentIntent = createAsyncThunk(
  'payment/createPaymentIntent',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/payments/create-intent');
      return data; // { clientSecret, paymentIntentId, total }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start payment');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    clientSecret: null,
    paymentIntentId: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetPaymentIntent(state) {
      state.clientSecret = null;
      state.paymentIntentId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload.clientSecret;
        state.paymentIntentId = action.payload.paymentIntentId;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPaymentIntent } = paymentSlice.actions;
export default paymentSlice.reducer;