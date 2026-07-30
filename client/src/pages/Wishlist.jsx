import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromWishlist } from "../redux/slices/wishlistSlice";

function Wishlist() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.wishlist.items);

  if (items.length === 0) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <h2>Your wishlist is empty</h2>
        <Link to="/products" style={{ color: "#4f46e5" }}>
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="catalogue-container">
      <h1>My Wishlist ({items.length})</h1>
      <div className="product-grid">
        {items.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-image">
              {product.images?.length > 0 && product.images[0]?.url ? (
                <img src={product.images[0].url} alt={product.name} />
              ) : (
                <div className="no-image">No Image Available</div>
              )}
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="price">Rs. {product.price}</p>
              <Link to={`/products/${product._id}`} className="details-btn">
                View Details
              </Link>
              <button
                onClick={() => dispatch(removeFromWishlist(product._id))}
                style={{
                  display: "block",
                  marginTop: "10px",
                  background: "#e11d48",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;