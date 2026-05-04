import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { mockNotifications } from '../../constants/mockData';
import { KEYS, getJson, setJson } from '../../utils/storage';
import type { NotificationItem } from '../../types';

interface NotificationsState {
  items: NotificationItem[];
}

const initialState: NotificationsState = {
  items: mockNotifications,
};

type Stored = { readIds: string[] };

export const loadNotificationState = createAsyncThunk('notifications/load', async () => {
  const stored = await getJson<Stored>(KEYS.NOTIF_READ);
  return stored?.readIds ?? [];
});

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markRead(state, action: PayloadAction<string>) {
      const n = state.items.find((x) => x.id === action.payload);
      if (n) n.read = true;
    },
    markAllRead(state) {
      state.items.forEach((n) => {
        n.read = true;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadNotificationState.fulfilled, (state, action) => {
      const readIds = new Set(action.payload);
      state.items = state.items.map((n) => ({
        ...n,
        read: n.read || readIds.has(n.id),
      }));
    });
  },
});

export const { markRead, markAllRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;

export async function persistNotificationReadIds(items: NotificationItem[]) {
  const readIds = items.filter((n) => n.read).map((n) => n.id);
  await setJson(KEYS.NOTIF_READ, { readIds });
}
