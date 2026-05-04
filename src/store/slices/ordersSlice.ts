import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { KEYS, getJson, setJson } from '../../utils/storage';
import type { Order, OrderStatus } from '../../types';

interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = { orders: [] };

export const loadOrders = createAsyncThunk('orders/load', async () => {
  const orders = await getJson<Order[]>(KEYS.ORDERS);
  return orders ?? [];
});

export const persistOrders = async (orders: Order[]) => {
  await setJson(KEYS.ORDERS, orders);
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.unshift(action.payload);
    },
    setOrderStatus(state, action: PayloadAction<{ orderId: string; status: OrderStatus }>) {
      const o = state.orders.find((x) => x.id === action.payload.orderId);
      if (o) o.status = action.payload.status;
    },
    cancelOrder(state, action: PayloadAction<string>) {
      const o = state.orders.find((x) => x.id === action.payload);
      if (o && o.status === 'Pending') o.status = 'Cancelled';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
    });
  },
});

export const { addOrder, setOrderStatus, cancelOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
