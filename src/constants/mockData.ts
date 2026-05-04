import type { NotificationItem } from '../types';
import { buildBabyProducts, buildCategories } from './babyCatalog';

export const categories = buildCategories();

export const products = buildBabyProducts();

/** Filter slider range (GBP) — wipes pack up to £30 */
export const priceBounds = { min: 0, max: 35 };

export const mockNotifications: NotificationItem[] = [
  { id: 'n1', title: 'Order shipped', body: 'Your formula order is on the way.', time: '2h ago', read: false },
  { id: 'n2', title: 'Bundle offer', body: 'Save on Pampers when you add wipes — this week only.', time: 'Yesterday', read: false },
  { id: 'n3', title: 'Back in stock', body: 'Kendamil Organic First Infant Milk is available again.', time: '2d ago', read: true },
  { id: 'n4', title: 'Address saved', body: 'Your shipping address was updated.', time: '3d ago', read: true },
];
