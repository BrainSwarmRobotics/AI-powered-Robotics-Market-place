import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../redux/slices/wishlistSlice";
import { toggleCompare } from "../redux/slices/compareSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const compareItems = useSelector((state) => state.compare.items);

  const isWishlisted = wishlistItems.some((p) => p._id === product._id);
  const isComparing = compareItems.some((p) => p._id === product._id);

  const handleWishlistClick = () => {
    dispatch(toggleWishlist(product));
  };

  const handleCompareClick = () => {
    dispatch(toggleCompare(product));
  };

  return (
    <div className="product-card">
      <div className="product-image" style={{ position: "relative" }}>
        {product.images?.length > 0 && product.images[0]?.url ? (
          <img src={product.images[0].url} alt={product.name} />
        ) : (
          <div className="no-image">No Image Available</div>
        )}

        <button
          onClick={handleWishlistClick}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "rgba(0,0,0,0.6)",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          {isWishlisted ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>

        <p>
          <strong>Category:</strong> {product.category}
        </p>

        <p className="price">
          Rs. {product.price}
        </p>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: "#ccc",
            margin: "8px 0",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={isComparing}
            onChange={handleCompareClick}
          />
          Compare
        </label>

        <Link
          to={`/products/${product._id}`}
          className="details-btn"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;