import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toggleCompare, clearCompare } from "../redux/slices/compareSlice";

const COMPARE_FIELDS = [
  { key: "price", label: "Price", format: (v) => `Rs. ${v?.toLocaleString()}` },
  { key: "manufacturer", label: "Manufacturer" },
  { key: "category", label: "Category" },
  { key: "processor", label: "Processor" },
  { key: "sensors", label: "Sensors" },
  { key: "battery", label: "Battery" },
  { key: "maxSpeed", label: "Max Speed" },
  { key: "warranty", label: "Warranty" },
  { key: "stock", label: "Stock" },
  { key: "communicationProtocols", label: "Communication Protocols" },
  { key: "utility", label: "Utility" },
];

function Compare() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.compare.items);

  if (items.length === 0) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <h2>No products selected for comparison</h2>
        <p style={{ color: "#ccc", margin: "1rem 0" }}>
          Add up to 3 products from the catalogue to compare them here.
        </p>
        <Link to="/products" style={{ color: "#4f46e5" }}>
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h1>Compare Products ({items.length}/3)</h1>
        <button
          onClick={() => dispatch(clearCompare())}
          style={{
            background: "#333",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Clear All
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ padding: "12px", textAlign: "left" }}></th>
            {items.map((product) => (
              <th key={product._id} style={{ padding: "12px", textAlign: "center" }}>
                {product.images?.[0]?.url && (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }}
                  />
                )}
                <div>
                  <Link to={`/products/${product._id}`} style={{ color: "#4f46e5" }}>
                    {product.name}
                  </Link>
                </div>
                <button
                  onClick={() => dispatch(toggleCompare(product))}
                  style={{
                    marginTop: "8px",
                    background: "#e11d48",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Remove
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE_FIELDS.map((field) => (
            <tr key={field.key} style={{ borderBottom: "1px solid #333" }}>
              <td style={{ padding: "12px", color: "#999", fontWeight: "bold" }}>
                {field.label}
              </td>
              {items.map((product) => (
                <td key={product._id} style={{ padding: "12px", textAlign: "center" }}>
                  {product[field.key]
                    ? field.format
                      ? field.format(product[field.key])
                      : product[field.key]
                    : "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Compare;