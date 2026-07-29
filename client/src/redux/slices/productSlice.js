import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

// Async thunk: fetches products from your backend
// Accepts an optional query params object (search, filter, sort, page)
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const response = await API.get('/products', { params: queryParams });
      return response.data; // { success, totalProducts, currentPage, totalPages, products }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      );
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],          // array of products
    totalProducts: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {
    // Place for simple synchronous actions later (e.g. clearProducts)
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;