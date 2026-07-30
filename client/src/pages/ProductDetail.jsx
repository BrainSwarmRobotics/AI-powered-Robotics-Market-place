import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, clearSelectedProduct } from "../redux/slices/productSlice";
import { toggleWishlist } from "../redux/slices/wishlistSlice";
import { toggleCompare } from "../redux/slices/compareSlice";

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedProduct: product, detailLoading, detailError } = useSelector(
    (state) => state.products
  );

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const compareItems = useSelector((state) => state.compare.items);

  const isWishlisted = product
    ? wishlistItems.some((p) => p._id === product._id)
    : false;
  const isComparing = product
    ? compareItems.some((p) => p._id === product._id)
    : false;

  useEffect(() => {
    dispatch(fetchProductById(id));

    // Clean up when leaving the page, so old product data doesn't flash on next visit
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  if (detailLoading) return <h2 style={{ padding: "2rem" }}>Loading product...</h2>;
  if (detailError) return <h2 style={{ padding: "2rem" }}>{detailError}</h2>;
  if (!product) return null;

  return (
    <div className="product-detail-container" style={{ padding: "2rem" }}>
      <Link to="/products" style={{ color: "#4f46e5" }}>
        &larr; Back to Catalogue
      </Link>

      <div
        style={{
          display: "flex",
          gap: "2rem",
          marginTop: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {/* Image Gallery */}
        <div style={{ flex: "1 1 350px" }}>
          {product.images && product.images.length > 0 ? (
            <div>
              <img
                src={product.images[0].url}
                alt={product.name}
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  marginBottom: "0.75rem",
                }}
              />
              {product.images.length > 1 && (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {product.images.slice(1).map((img) => (
                    <img
                      key={img.public_id}
                      src={img.url}
                      alt={product.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                height: "300px",
                background: "#333",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#888",
              }}
            >
              No Image Available
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ flex: "1 1 400px" }}>
          <h1 style={{ marginBottom: "0.5rem" }}>{product.name}</h1>
          <p style={{ color: "#00d084", fontSize: "1.5rem", fontWeight: "bold" }}>
            Rs. {product.price?.toLocaleString()}
          </p>

          {/* Wishlist / Compare Buttons */}
          <div style={{ display: "flex", gap: "1rem", margin: "1rem 0" }}>
            <button
              onClick={() => dispatch(toggleWishlist(product))}
              style={{
                background: isWishlisted ? "#e11d48" : "#333",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {isWishlisted ? "❤️ Remove from Wishlist" : "🤍 Add to Wishlist"}
            </button>

            <button
              onClick={() => dispatch(toggleCompare(product))}
              style={{
                background: isComparing ? "#4f46e5" : "#333",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {isComparing ? "✓ Added to Compare" : "+ Add to Compare"}
            </button>
          </div>

          <p style={{ margin: "1rem 0", color: "#ccc" }}>{product.description}</p>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                ["Manufacturer", product.manufacturer],
                ["Category", product.category],
                ["Processor", product.processor],
                ["Sensors", product.sensors],
                ["Battery", product.battery],
                ["Max Speed", product.maxSpeed],
                ["Warranty", product.warranty],
                ["Stock", product.stock],
                ["Communication Protocols", product.communicationProtocols],
                ["Utility", product.utility],
                ["Documentation", product.documentation],
              ].map(([label, value]) =>
                value ? (
                  <tr key={label} style={{ borderBottom: "1px solid #333" }}>
                    <td style={{ padding: "0.5rem 0", color: "#999", width: "40%" }}>
                      {label}
                    </td>
                    <td style={{ padding: "0.5rem 0" }}>{value}</td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>

          {product.educationalApplications && (
            <div style={{ marginTop: "1.5rem" }}>
              <h3 style={{ marginBottom: "0.5rem" }}>Educational Applications</h3>
              <p style={{ color: "#ccc" }}>{product.educationalApplications}</p>
            </div>
          )}

          {product.researchApplications && (
            <div style={{ marginTop: "1.5rem" }}>
              <h3 style={{ marginBottom: "0.5rem" }}>Research Applications</h3>
              <p style={{ color: "#ccc" }}>{product.researchApplications}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;