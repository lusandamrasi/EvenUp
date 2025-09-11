import { Platform } from 'react-native';

// API Configuration
export const API_CONFIG = {
  // Base URLs
  BASE_URL: __DEV__ 
    ? Platform.OS === 'android' 
      ? `http://10.0.2.2:3000/api/v1`
      : `http://localhost:3000/api/v1`
    : 'https://api.evenup.app/v1',
  
  SOCKET_URL: __DEV__
    ? Platform.OS === 'android'
      ? 'http://10.0.2.2:3000'
      : 'http://localhost:3000'
    : 'https://api.evenup.app',
  
  // Request timeouts
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  
  // Headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export const ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  
  // Restaurants
  RESTAURANTS: {
    LIST: '/restaurants',
    DETAIL: (id: number) => `/restaurants/${id}`,
    CREATE: '/restaurants',
    UPDATE: (id: number) => `/restaurants/${id}`,
    DELETE: (id: number) => `/restaurants/${id}`,
    SEARCH: '/restaurants/search',
  },
  
  // Menu
  MENU: {
    RESTAURANT: (restaurantId: number) => `/menus/restaurant/${restaurantId}`,
    ITEM: (id: number) => `/menus/${id}`,
    CREATE: '/menus',
    UPDATE: (id: number) => `/menus/${id}`,
    DELETE: (id: number) => `/menus/${id}`,
  },
  
  // Orders
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAIL: (id: number) => `/orders/${id}`,
    UPDATE: (id: number) => `/orders/${id}`,
    DELETE: (id: number) => `/orders/${id}`,
  },
  
  // Groups
  GROUPS: {
    CREATE: '/groups',
    JOIN: '/groups/join',
    LIST: '/groups',
    DETAIL: (id: number) => `/groups/${id}`,
    LEAVE: (id: number) => `/groups/${id}/leave`,
    MEMBERS: (id: number) => `/groups/${id}/members`,
  },
  
  // Payments
  PAYMENTS: {
    CREATE: '/payments',
    LIST: '/payments',
    DETAIL: (id: number) => `/payments/${id}`,
    CONFIRM: (id: number) => `/payments/${id}/confirm`,
  },
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;