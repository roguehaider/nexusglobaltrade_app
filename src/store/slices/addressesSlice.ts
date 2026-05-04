import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { KEYS, getJson, setJson } from '../../utils/storage';
import type { Address } from '../../types';

interface AddressesState {
  list: Address[];
}

const initialState: AddressesState = { list: [] };

export const loadAddresses = createAsyncThunk('addresses/load', async () => {
  const list = await getJson<Address[]>(KEYS.ADDRESSES);
  return list ?? [];
});

export const persistAddresses = async (list: Address[]) => {
  await setJson(KEYS.ADDRESSES, list);
};

const addressesSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    addAddress(state, action: PayloadAction<Address>) {
      state.list.push(action.payload);
    },
    updateAddress(state, action: PayloadAction<Address>) {
      const i = state.list.findIndex((a) => a.id === action.payload.id);
      if (i >= 0) state.list[i] = action.payload;
    },
    removeAddress(state, action: PayloadAction<string>) {
      state.list = state.list.filter((a) => a.id !== action.payload);
    },
    setDefault(state, action: PayloadAction<string>) {
      state.list = state.list.map((a) => ({
        ...a,
        isDefault: a.id === action.payload,
      }));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadAddresses.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export const { addAddress, updateAddress, removeAddress, setDefault } = addressesSlice.actions;
export default addressesSlice.reducer;
