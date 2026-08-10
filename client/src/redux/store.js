import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import wishlistReducer from './slices/wishlistSlice';
import compareReducer from './slices/compareSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
    wishlist: wishlistReducer,
    compare: compareReducer,
    cart: cartReducer,
  },
});

export default store;