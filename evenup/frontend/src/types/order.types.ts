import { MenuItem, Restaurant } from './restaurant.types';
import { User } from './auth.types';

// Order Types
export interface Order {
  id: number;
  group_id: number;
  user_id: number;
  menu_item_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  // Joined data
  menu_item?: MenuItem;
  user?: User;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served';

export interface Group {
  id: number;
  name: string;
  restaurant_id: number;
  creator_id: number;
  group_code: string;
  table_number?: string;
  status: GroupStatus;
  total_amount: number;
  tip_amount: number;
  tax_amount: number;
  created_at: string;
  updated_at: string;
  // Joined data
  restaurant?: Restaurant;
  members?: GroupMember[];
  orders?: Order[];
}

export type GroupStatus = 'active' | 'completed' | 'cancelled';

export interface GroupMember {
  id: number;
  group_id: number;
  user_id: number;
  joined_at: string;
  user?: User;
}

export interface CreateOrderRequest {
  group_id: number;
  menu_item_id: number;
  quantity: number;
  special_instructions?: string;
}

export interface CreateGroupRequest {
  name: string;
  restaurant_id: number;
  table_number?: string;
}

export interface JoinGroupRequest {
  group_code: string;
}

export interface OrderState {
  currentGroup: Group | null;
  userGroups: Group[];
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

export interface Payment {
  id: number;
  group_id: number;
  user_id: number;
  amount: number;
  payment_method: string;
  payment_status: PaymentStatus;
  stripe_payment_intent_id?: string;
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface BillSummary {
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  userTotal: number;
  splitType: 'equal' | 'itemized';
}