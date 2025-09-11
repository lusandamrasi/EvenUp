import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '@constants/api';
import { RootState } from '../index';

// Base query with auth header
const baseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  prepareHeaders: (headers, { getState }) => {\n    // Add auth token to headers\n    const token = (getState() as RootState).auth.token;\n    if (token) {\n      headers.set('authorization', `Bearer ${token}`);\n    }\n    \n    // Add default headers\n    Object.entries(API_CONFIG.HEADERS).forEach(([key, value]) => {\n      headers.set(key.toLowerCase(), value);\n    });\n    \n    return headers;\n  },\n});\n\n// Base query with retry and error handling\nconst baseQueryWithRetry = async (args: any, api: any, extraOptions: any) => {\n  let result = await baseQuery(args, api, extraOptions);\n  \n  // Handle 401 Unauthorized - logout user\n  if (result.error && result.error.status === 401) {\n    // Dispatch logout action\n    api.dispatch({ type: 'auth/logout' });\n  }\n  \n  return result;\n};\n\nexport const apiSlice = createApi({\n  reducerPath: 'api',\n  baseQuery: baseQueryWithRetry,\n  tagTypes: ['User', 'Restaurant', 'MenuItem', 'Order', 'Group', 'Payment'],\n  endpoints: (builder) => ({\n    // Placeholder endpoints - these will be extended in specific API files\n  }),\n});\n\nexport const {} = apiSlice;"
}]