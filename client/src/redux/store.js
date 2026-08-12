import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import wishlistReducer from './slices/wishlistSlice';
import compareReducer from './slices/compareSlice';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import orderReducer from './slices/orderSlice';


export const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
    wishlist: wishlistReducer,
    compare: compareReducer,
    cart: cartReducer,
    auth: authReducer,
    orders: orderReducer,
  },
});

export default store;