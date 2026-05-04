import type { Product, ProductFilters } from '../types';
import { products as allProducts } from '../constants/mockData';

export function filterAndSort(list: Product[], filters: ProductFilters, searchQuery?: string) {
  let result = [...list];
  const q = searchQuery?.trim().toLowerCase();
  if (q) {
    result = result.filter((p) => {
      const hay = [
        p.title,
        p.category,
        p.description,
        p.brand ?? '',
        ...(Array.isArray(p.tags) ? p.tags : []),
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }
  if (filters.categoryId) {
    result = result.filter((p) => p.categoryId === filters.categoryId);
  }
  result = result.filter(
    (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice && p.rating >= filters.minRating,
  );
  if (filters.sortBy === 'price_asc') result.sort((a, b) => a.price - b.price);
  else if (filters.sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
  else result.sort((a, b) => b.popularity - a.popularity);
  return result;
}

export function getProductById(id: string) {
  return allProducts.find((p) => p.id === id);
}

export function getProductsForCategory(categoryId: string | null) {
  if (!categoryId) return allProducts;
  return allProducts.filter((p) => p.categoryId === categoryId);
}
