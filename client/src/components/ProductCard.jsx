import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-image">
        {product.images?.length > 0 && product.images[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.name}
          />
        ) : (
          <div className="no-image">No Image Available</div>
        )}
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>

        <p><strong>Manufacturer:</strong> {product.manufacturer}</p>

        <p><strong>Category:</strong> {product.category}</p>

        <p><strong>Description:</strong> {product.description}</p>

        <p><strong>Processor:</strong> {product.processor}</p>

        <p><strong>Sensors:</strong> {product.sensors}</p>

        <p><strong>Battery:</strong> {product.battery}</p>

        <p><strong>Maximum Speed:</strong> {product.maxSpeed}</p>

        <p><strong>Warranty:</strong> {product.warranty}</p>

        <p><strong>Communication:</strong> {product.communicationProtocols}</p>

        <p><strong>Utility:</strong> {product.utility}</p>

        <p><strong>Educational Applications:</strong> {product.educationalApplications}</p>

        <p><strong>Research Applications:</strong> {product.researchApplications}</p>

        <p><strong>Documentation:</strong> {product.documentation}</p>

        <p><strong>Stock:</strong> {product.stock}</p>

        <p className="price">
          Rs. {product.price}
        </p>

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