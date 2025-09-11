import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '@constants/api';
import { RootState } from '../index';

// Base query with auth header
const baseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  prepareHeaders: (headers, { getState }) => {
    // Add auth token to headers
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    // Add default headers
    Object.entries(API_CONFIG.HEADERS).forEach(([key, value]) => {
      headers.set(key.toLowerCase(), value);
    });
    
    return headers;
  },
});

// Base query with retry and error handling
const baseQueryWithRetry = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // Handle 401 Unauthorized - logout user
  if (result.error && result.error.status === 401) {
    // Dispatch logout action
    api.dispatch({ type: 'auth/logout' });
  }
  
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['User', 'Restaurant', 'MenuItem', 'Order', 'Group', 'Payment'],
  endpoints: (builder) => ({
    // Placeholder endpoints - these will be extended in specific API files
  }),
});

export const {} = apiSlice;