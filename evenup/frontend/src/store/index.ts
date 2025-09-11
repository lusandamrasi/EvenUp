import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import slices
import authSlice from './slices/authSlice';
import restaurantSlice from './slices/restaurantSlice';
import orderSlice from './slices/orderSlice';
import groupSlice from './slices/groupSlice';

// Import API slice
import { apiSlice } from './api/apiSlice';
import './api/authApi';
import './api/restaurantApi';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    restaurant: restaurantSlice,
    order: orderSlice,
    group: groupSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiSlice.middleware),
  devTools: __DEV__,
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;