import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/slices/categorySlice";

function FilterPanel({ filters, onFilterChange }) {
  const dispatch = useDispatch();
  const { items: categories } = useSelector((state) => state.categories);

  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || "");
  const isFirstRender = useRef(true);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // skip firing onFilterChange on mount
    }

    const timer = setTimeout(() => {
      onFilterChange({ maxPrice: maxPrice || undefined });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxPrice]);

  return (
    <div className="filter-panel">
      <h3>Filters</h3>

      <div className="filter-group">
        <label>Category</label>
        <select
          value={filters.category || ""}
          onChange={(e) =>
            onFilterChange({ category: e.target.value || undefined })
          }
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Max Price (Rs.)</label>
        <input
          type="number"
          placeholder="e.g. 200000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          min="0"
        />
      </div>

      <div className="filter-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={!!filters.stock}
            onChange={(e) =>
              onFilterChange({ stock: e.target.checked ? 1 : undefined })
            }
          />
          In Stock Only
        </label>
      </div>

      <div className="filter-group">
        <label>Sort By</label>
        <select
          value={filters.sort || "-createdAt"}
          onChange={(e) => onFilterChange({ sort: e.target.value })}
        >
          <option value="-createdAt">Newest First</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="name">Name: A-Z</option>
        </select>
      </div>

      <button
        className="reset-filters-btn"
        onClick={() => {
          setMaxPrice("");
          onFilterChange({
            category: undefined,
            maxPrice: undefined,
            stock: undefined,
            sort: "-createdAt",
          });
        }}
      >
        Reset Filters
      </button>
    </div>
  );
}

export default FilterPanel;