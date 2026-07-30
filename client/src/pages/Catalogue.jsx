import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";

function Catalogue() {
  const dispatch = useDispatch();

  const {
    items,
    loading,
    error,
    currentPage,
    totalPages,
  } = useSelector((state) => state.products);

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts({ page }));
  }, [dispatch, page]);

  if (loading) {
    return <h2>Loading Products...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="catalogue-container">
      <h1>Product Catalogue</h1>

      <div className="product-grid">
        {items.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Catalogue;