import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProductFilters, SortOption } from '../../types';
import { priceBounds } from '../../constants/mockData';

const initialFilters: ProductFilters = {
  categoryId: null,
  minPrice: priceBounds.min,
  maxPrice: priceBounds.max,
  minRating: 0,
  sortBy: 'popularity',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState: initialFilters,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<ProductFilters>>) {
      return { ...state, ...action.payload };
    },
    setSortBy(state, action: PayloadAction<SortOption>) {
      state.sortBy = action.payload;
    },
    resetFilters() {
      return { ...initialFilters };
    },
  },
});

export const { setFilters, setSortBy, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
