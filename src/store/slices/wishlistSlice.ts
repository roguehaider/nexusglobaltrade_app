import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { KEYS, getJson, setJson } from '../../utils/storage';

interface WishlistState {
  ids: string[];
}

const initialState: WishlistState = { ids: [] };

export const loadWishlist = createAsyncThunk('wishlist/load', async () => {
  const ids = await getJson<string[]>(KEYS.WISHLIST);
  return ids ?? [];
});

export const persistWishlist = async (ids: string[]) => {
  await setJson(KEYS.WISHLIST, ids);
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.ids.includes(id)) state.ids = state.ids.filter((x) => x !== id);
      else state.ids.push(id);
    },
    hydrateWishlist(state, action: PayloadAction<string[]>) {
      state.ids = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadWishlist.fulfilled, (state, action) => {
      state.ids = action.payload;
    });
  },
});

export const { toggleWishlist, hydrateWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
