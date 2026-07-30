import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-image">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0].url} alt={product.name} />
        ) : (
          <div className="no-image">No Image Available</div>
        )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="category-tag">{product.category}</p>
        <p className="price">Rs. {product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}

export default ProductCard;