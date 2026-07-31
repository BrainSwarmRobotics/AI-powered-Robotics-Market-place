import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { clearLimitMessage } from "../redux/slices/compareSlice";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";

function Catalogue() {
  const dispatch = useDispatch();
  const { items, loading, error, currentPage, totalPages } = useSelector(
    (state) => state.products
  );

  const limitMessage = useSelector((state) => state.compare.limitMessage);

  const [page, setPage] = useState(1);
  const [queryParams, setQueryParams] = useState({
    keyword: undefined,
    category: undefined,
    maxPrice: undefined,
    stock: undefined,
    sort: "-createdAt",
  });

  useEffect(() => {
    dispatch(fetchProducts({ ...queryParams, page }));
  }, [dispatch, queryParams, page]);

  // Auto-hide the compare limit warning after 3 seconds
  useEffect(() => {
    if (limitMessage) {
      const timer = setTimeout(() => {
        dispatch(clearLimitMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [limitMessage, dispatch]);

  const handleSearch = useCallback((keyword) => {
    setQueryParams((prev) => ({ ...prev, keyword: keyword || undefined }));
    setPage(1);
  }, []);

  const handleFilterChange = useCallback((changedFields) => {
    setQueryParams((prev) => ({ ...prev, ...changedFields }));
    setPage(1);
  }, []);

  return (
    <div className="catalogue-container">
      <h1>Product Catalogue</h1>
      <SearchBar onSearch={handleSearch} />

      {limitMessage && (
        <div
          style={{
            background: "#e11d48",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            margin: "1rem 0",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {limitMessage}
        </div>
      )}

      <div className="catalogue-layout">
        <FilterPanel filters={queryParams} onFilterChange={handleFilterChange} />

        <div className="catalogue-main">
          {loading ? (
            <h2>Loading Products...</h2>
          ) : error ? (
            <h2>{error}</h2>
          ) : (
            <>
              <div className="product-grid">
                {items.length > 0 ? (
                  items.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <h2>No products found.</h2>
                )}
              </div>

              <div className="pagination">
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Catalogue;