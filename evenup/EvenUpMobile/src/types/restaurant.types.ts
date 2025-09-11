// Restaurant Types
export interface Restaurant {
  id: number;
  name: string;
  address: string;
  phone?: string;
  cuisine_type?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: number;
  restaurant_id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  dietary_info: string[];
  image_url?: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface RestaurantFilters {
  search?: string;
  cuisine_type?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  price_range?: [number, number];
}

export interface RestaurantListResponse {
  success: boolean;
  data: {
    restaurants: Restaurant[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface MenuResponse {
  success: boolean;
  data: {
    menuItems: MenuItem[];
  };
}

export interface RestaurantState {
  restaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  menuItems: MenuItem[];
  isLoading: boolean;
  error: string | null;
  filters: RestaurantFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}