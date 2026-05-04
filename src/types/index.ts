export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Product {
  id: string;
  /** Display name (same as catalogue “name”) */
  title: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  categoryId: string;
  image: string;
  images: string[];
  description: string;
  /** Units available (fulfilment simulation) */
  stock?: number;
  inStock: boolean;
  popularity: number;
  /** Search & filter keywords */
  tags?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  phone: string;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  address: Address;
  paymentMethod: string;
}

export type SortOption = 'popularity' | 'price_asc' | 'price_desc';

export interface ProductFilters {
  categoryId: string | null;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: SortOption;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}
