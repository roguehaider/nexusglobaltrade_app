import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: '@nexus_user',
  ONBOARDING: '@nexus_onboarding',
  CART: '@nexus_cart',
  ADDRESSES: '@nexus_addresses',
  ORDERS: '@nexus_orders',
  WISHLIST: '@nexus_wishlist',
  NOTIF_READ: '@nexus_notif_read',
} as const;

export async function getJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setJson(key: string, value: unknown) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeKey(key: string) {
  await AsyncStorage.removeItem(key);
}

export { KEYS };
