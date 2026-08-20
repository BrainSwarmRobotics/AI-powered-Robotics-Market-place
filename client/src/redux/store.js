import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import wishlistReducer from './slices/wishlistSlice';
import compareReducer from './slices/compareSlice';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import orderReducer from './slices/orderSlice';
import paymentReducer from './slices/paymentSlice';
import adminInventoryReducer from './slices/adminInventorySlice';
import adminCustomersReducer from './slices/adminCustomersSlice';
import adminOrdersReducer from './slices/adminOrdersSlice';
import adminCouponsReducer from './slices/adminCouponsSlice';
import adminAnalyticsReducer from './slices/adminAnalyticsSlice';
import reviewReducer from './slices/reviewSlice';
import adminReviewsReducer from './slices/adminReviewsSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
    wishlist: wishlistReducer,
    compare: compareReducer,
    cart: cartReducer,
    auth: authReducer,
    orders: orderReducer,
    payment: paymentReducer,
    adminInventory: adminInventoryReducer,
    adminCustomers: adminCustomersReducer,
    adminOrders: adminOrdersReducer,
    adminCoupons: adminCouponsReducer,
    adminAnalytics: adminAnalyticsReducer,
    reviews: reviewReducer,
    adminReviews: adminReviewsReducer,
  },
});

export default store;