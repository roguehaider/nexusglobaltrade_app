import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { KEYS, getJson, setJson } from '../../utils/storage';
import type { CartItem, Product } from '../../types';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

export const loadCart = createAsyncThunk('cart/load', async () => {
  const items = await getJson<CartItem[]>(KEYS.CART);
  return items ?? [];
});

export const persistCart = async (items: CartItem[]) => {
  await setJson(KEYS.CART, items);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ product: Product; quantity?: number }>) {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) existing.quantity += quantity;
      else state.items.push({ product, quantity });
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.product.id !== action.payload);
    },
    setQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const item = state.items.find((i) => i.product.id === action.payload.productId);
      if (!item) return;
      item.quantity = Math.max(1, action.payload.quantity);
    },
    increment(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.product.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrement(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.product.id === action.payload);
      if (!item) return;
      item.quantity -= 1;
      if (item.quantity <= 0) {
        state.items = state.items.filter((i) => i.product.id !== action.payload);
      }
    },
    clearCart(state) {
      state.items = [];
    },
    hydrateCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCart.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const {
  addToCart,
  removeFromCart,
  setQuantity,
  increment,
  decrement,
  clearCart,
  hydrateCart,
} = cartSlice.actions;
export default cartSlice.reducer;
