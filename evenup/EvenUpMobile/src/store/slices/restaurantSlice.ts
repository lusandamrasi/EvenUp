import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RestaurantState, Restaurant, MenuItem, RestaurantFilters } from '@types/restaurant.types';

const initialState: RestaurantState = {
  restaurants: [],
  currentRestaurant: null,
  menuItems: [],
  isLoading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasMore: true,
  },
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setRestaurants: (state, action: PayloadAction<Restaurant[]>) => {
      state.restaurants = action.payload;
    },
    addRestaurants: (state, action: PayloadAction<Restaurant[]>) => {
      state.restaurants = [...state.restaurants, ...action.payload];
    },
    setCurrentRestaurant: (state, action: PayloadAction<Restaurant | null>) => {
      state.currentRestaurant = action.payload;
    },
    setMenuItems: (state, action: PayloadAction<MenuItem[]>) => {
      state.menuItems = action.payload;
    },
    setFilters: (state, action: PayloadAction<RestaurantFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setPagination: (state, action: PayloadAction<Partial<typeof initialState.pagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetRestaurants: (state) => {
      state.restaurants = [];
      state.pagination = initialState.pagination;
    },
  },
});

export const {
  setLoading,
  setError,
  setRestaurants,
  addRestaurants,
  setCurrentRestaurant,
  setMenuItems,
  setFilters,
  clearFilters,
  setPagination,
  resetRestaurants,
} = restaurantSlice.actions;

export default restaurantSlice.reducer;

// Selectors
export const selectRestaurants = (state: { restaurant: RestaurantState }) => state.restaurant.restaurants;
export const selectCurrentRestaurant = (state: { restaurant: RestaurantState }) => state.restaurant.currentRestaurant;
export const selectMenuItems = (state: { restaurant: RestaurantState }) => state.restaurant.menuItems;
export const selectRestaurantLoading = (state: { restaurant: RestaurantState }) => state.restaurant.isLoading;
export const selectRestaurantError = (state: { restaurant: RestaurantState }) => state.restaurant.error;
export const selectRestaurantFilters = (state: { restaurant: RestaurantState }) => state.restaurant.filters;
export const selectRestaurantPagination = (state: { restaurant: RestaurantState }) => state.restaurant.pagination;