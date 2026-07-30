import { Link } from 'react-router-dom';

function FeaturedProducts({ products, loading }) {
  return (
    <section>
      <h2 style={{ marginBottom: '1rem' }}>Featured Products</h2>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              style={{ background: '#242424', borderRadius: '8px', padding: '1rem', textDecoration: 'none', color: 'white', border: '1px solid #333' }}
            >
              <div style={{ width: '100%', height: '150px', background: '#333', borderRadius: '6px', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0].url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: '#888' }}>No Image</span>
                )}
              </div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{product.name}</h3>
              <p style={{ color: '#aaa' }}>Rs. {product.price.toLocaleString()}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default FeaturedProducts;