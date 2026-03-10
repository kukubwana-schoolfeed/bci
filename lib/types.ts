// =========================================
// PRODUCT
// =========================================
export interface Product {
  id: string;
  category: 'fashion' | 'tech';
  subcategory: string;
  name: string;
  price: number;
  originalPrice?: number;
  badge: string;
  tags: string[];
  description: string;
  image: string;
  stock: number;
  inStock: boolean;
  preOrder: boolean;
  flashSaleId?: string;
  flashSalePrice?: number;
}

// =========================================
// CART
// =========================================
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  updatedAt: string;
}

// =========================================
// USER / AUTH
// =========================================
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  loyaltyPoints: number;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  referralCode: string;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  area: string;
  city: string;
  isDefault: boolean;
}

// =========================================
// ORDER
// =========================================
export type OrderStatus = 'received' | 'processing' | 'dispatched' | 'delivered';
export type PaymentMethod = 'airtel' | 'momo' | 'card';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  ref: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  loyaltyPointsEarned: number;
  loyaltyPointsRedeemed: number;
  paymentMethod: PaymentMethod;
  deliveryAddress: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

// =========================================
// MESSAGE
// =========================================
export type MessagePlatform = 'app' | 'whatsapp';

export interface Message {
  id: string;
  customerId?: string;
  customer: string;
  message: string;
  time: string;
  read: boolean;
  platform: MessagePlatform;
  replies?: MessageReply[];
  createdAt?: string;
}

export interface MessageReply {
  id: string;
  sender: 'admin' | 'customer';
  text: string;
  time: string;
}

// =========================================
// BROADCAST
// =========================================
export type BroadcastTarget = 'all' | 'gold_plus' | 'bronze' | 'custom';
export type BroadcastChannel = 'in_app' | 'sms';

export interface Broadcast {
  id: string;
  name: string;
  target: BroadcastTarget;
  channel: BroadcastChannel;
  message: string;
  estimatedReach: number;
  actualReach: number;
  openRate: number;
  sentAt: string;
  status: 'sent' | 'draft';
}

// =========================================
// FLASH SALE
// =========================================
export interface FlashSale {
  id: string;
  productId: string;
  productName: string;
  originalPrice: number;
  salePrice: number;
  percentOff: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

// =========================================
// STAFF
// =========================================
export type StaffRole = 'owner' | 'manager' | 'sales' | 'inventory';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  lastActive: string;
  status: 'active' | 'inactive';
  permissions: Record<string, boolean>;
}

// =========================================
// LOYALTY
// =========================================
export interface LoyaltyTier {
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  min: number;
  max: number;
  color: string;
  perks: string[];
}

export interface LoyaltyTransaction {
  id: string;
  type: 'earned' | 'redeemed' | 'bonus';
  points: number;
  description: string;
  date: string;
}

// =========================================
// ANALYTICS
// =========================================
export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  topCustomer: string;
  revenueByCategory: { fashion: number; tech: number };
  ordersByDay: { day: string; orders: number; revenue: number }[];
  topProducts: { productId: string; name: string; sales: number; revenue: number }[];
}
