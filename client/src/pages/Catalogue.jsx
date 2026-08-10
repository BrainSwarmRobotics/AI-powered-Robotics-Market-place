import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import Pagination from '../components/Pagination';
import ProductCard from '../components/ProductCard';
import Select from '../components/ui/Select';
import { fetchProducts } from '../redux/slices/productSlice';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A–Z' },
];

export default function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const {
    items: products,
    totalPages,
    currentPage,
    loading,
  } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || '-createdAt';
  const page = Number(searchParams.get('page') || 1);

  const queryParams = useMemo(
    () => ({
      search: search || undefined,
      category: category || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      sort,
      page,
    }),
    [search, category, minPrice, maxPrice, sort, page]
  );

  useEffect(() => {
    dispatch(fetchProducts(queryParams));
  }, [dispatch, queryParams]);

  function updateParams(updates) {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    // Any filter/search/sort change resets pagination, unless page itself changed.
    if (!('page' in updates)) next.delete('page');
    setSearchParams(next);
  }

  return (
    <div className="py-8 sm:py-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-ink">All Products</h1>
        <SearchBar value={search} onSearch={(val) => updateParams({ search: val })} />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <FilterPanel
          categories={categories}
          filters={{ category, minPrice, maxPrice }}
          onApply={(f) => updateParams(f)}
        />
        <Select
          aria-label="Sort by"
          value={sort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          options={SORT_OPTIONS}
          className="w-48"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-[var(--radius-panel)] bg-neutral-100" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-neutral-600">No products match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => updateParams({ page: String(p) })}
          />
        </div>
      )}
    </div>
  );
}
