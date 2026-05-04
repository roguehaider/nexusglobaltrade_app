import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { KEYS, getJson, removeKey, setJson } from '../../utils/storage';
import type { User } from '../../types';

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

export const loadUser = createAsyncThunk('auth/loadUser', async () => {
  const user = await getJson<User>(KEYS.USER);
  return user;
});

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string; name?: string }) => {
    const user: User = {
      id: `u_${Date.now()}`,
      name: payload.name ?? 'Nexus Customer',
      email: payload.email.trim().toLowerCase(),
      phone: '+1 555 0100',
    };
    await setJson(KEYS.USER, user);
    return user;
  },
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (payload: { name: string; email: string; password: string; phone: string }) => {
    const user: User = {
      id: `u_${Date.now()}`,
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim(),
    };
    await setJson(KEYS.USER, user);
    return user;
  },
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await removeKey(KEYS.USER);
});

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (payload: Partial<Pick<User, 'name' | 'phone' | 'email'>> & { id: string }) => {
    const current = await getJson<User>(KEYS.USER);
    if (!current) throw new Error('No user');
    const next: User = {
      ...current,
      ...payload,
      email: payload.email?.trim().toLowerCase() ?? current.email,
      name: payload.name?.trim() ?? current.name,
      phone: payload.phone?.trim() ?? current.phone,
    };
    await setJson(KEYS.USER, next);
    return next;
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
