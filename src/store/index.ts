import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
  isAnyOf,
  type AnyAction,
  type ThunkDispatch,
  type TypedStartListening,
} from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import authReducer from './slices/authSlice';
import cartReducer, {
  addToCart,
  clearCart,
  decrement,
  hydrateCart,
  increment,
  loadCart,
  persistCart,
  removeFromCart,
  setQuantity,
} from './slices/cartSlice';
import ordersReducer, {
  addOrder,
  cancelOrder,
  loadOrders,
  persistOrders,
  setOrderStatus,
} from './slices/ordersSlice';
import wishlistReducer, {
  hydrateWishlist,
  loadWishlist,
  persistWishlist,
  toggleWishlist,
} from './slices/wishlistSlice';
import addressesReducer, {
  addAddress,
  loadAddresses,
  persistAddresses,
  removeAddress,
  setDefault,
  updateAddress,
} from './slices/addressesSlice';
import filtersReducer from './slices/filtersSlice';
import notificationsReducer, {
  markAllRead,
  markRead,
  persistNotificationReadIds,
} from './slices/notificationsSlice';

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  cart: cartReducer,
  orders: ordersReducer,
  wishlist: wishlistReducer,
  addresses: addressesReducer,
  filters: filtersReducer,
  notifications: notificationsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

/** Avoid crashing / spamming logs when native bridge isn't ready (e.g. storage init race). */
async function safePersist(run: () => Promise<void>) {
  try {
    await run();
  } catch {
    /* AsyncStorage can briefly be unavailable during startup; retry on next action */
  }
}

const listenerMiddleware = createListenerMiddleware();
type AppStartListening = TypedStartListening<RootState, AppDispatch>;
const startAppListening = listenerMiddleware.startListening as AppStartListening;

startAppListening({
  matcher: isAnyOf(
    addToCart,
    removeFromCart,
    setQuantity,
    increment,
    decrement,
    clearCart,
    hydrateCart,
    loadCart.fulfilled,
  ),
  effect: async (_action, listenerApi) => {
    const { cart } = listenerApi.getState();
    await safePersist(() => persistCart(cart.items));
  },
});

startAppListening({
  matcher: isAnyOf(addOrder, cancelOrder, setOrderStatus, loadOrders.fulfilled),
  effect: async (_action, listenerApi) => {
    const { orders } = listenerApi.getState();
    await safePersist(() => persistOrders(orders.orders));
  },
});

startAppListening({
  matcher: isAnyOf(toggleWishlist, hydrateWishlist, loadWishlist.fulfilled),
  effect: async (_action, listenerApi) => {
    const { wishlist } = listenerApi.getState();
    await safePersist(() => persistWishlist(wishlist.ids));
  },
});

startAppListening({
  matcher: isAnyOf(addAddress, updateAddress, removeAddress, setDefault, loadAddresses.fulfilled),
  effect: async (_action, listenerApi) => {
    const { addresses } = listenerApi.getState();
    await safePersist(() => persistAddresses(addresses.list));
  },
});

startAppListening({
  matcher: isAnyOf(markRead, markAllRead),
  effect: async (_action, listenerApi) => {
    const { notifications } = listenerApi.getState();
    await safePersist(() => persistNotificationReadIds(notifications.items));
  },
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});
