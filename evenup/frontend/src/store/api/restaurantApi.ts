import { apiSlice } from './apiSlice';
import { RestaurantListResponse, MenuResponse, Restaurant } from '@types/restaurant.types';

export const restaurantApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRestaurants: builder.query<RestaurantListResponse, {
      page?: number;
      limit?: number;
      search?: string;
      cuisine_type?: string;
    }>({
      query: ({ page = 1, limit = 10, search, cuisine_type } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        
        if (search) params.append('search', search);
        if (cuisine_type) params.append('cuisine_type', cuisine_type);
        
        return `/restaurants?${params.toString()}`;
      },
      providesTags: ['Restaurant'],
    }),
    
    getRestaurantById: builder.query<{ success: boolean; data: { restaurant: Restaurant } }, number>({
      query: (id) => `/restaurants/${id}`,
      providesTags: (result, error, id) => [{ type: 'Restaurant', id }],
    }),
    
    getMenuItems: builder.query<MenuResponse, number>({
      query: (restaurantId) => `/menus/restaurant/${restaurantId}`,
      providesTags: (result, error, restaurantId) => [
        { type: 'MenuItem', id: `restaurant-${restaurantId}` }
      ],
    }),
    
    createRestaurant: builder.mutation<{ success: boolean; data: { restaurant: Restaurant } }, Omit<Restaurant, 'id' | 'created_at' | 'updated_at'>>({
      query: (restaurant) => ({
        url: '/restaurants',
        method: 'POST',
        body: restaurant,
      }),
      invalidatesTags: ['Restaurant'],
    }),
  }),
});

export const {
  useGetRestaurantsQuery,
  useGetRestaurantByIdQuery,
  useGetMenuItemsQuery,
  useCreateRestaurantMutation,
} = restaurantApi;