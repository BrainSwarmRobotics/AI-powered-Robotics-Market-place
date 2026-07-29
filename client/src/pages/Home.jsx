import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../redux/slices/productSlice';
import { fetchCategories } from '../redux/slices/categorySlice';

function Home() {
  const dispatch = useDispatch();

  const { items: products, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { items: categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    // Featured products: newest first, limit handled by backend pagination (first page = first 10)
    dispatch(fetchProducts({ sort: '-createdAt' }));
    dispatch(fetchCategories());
  }, [dispatch]);

  // Take first 4 products as "featured"
  const featuredProducts = products.slice(0, 4);

  return (
    <div style={{ color: 'white', padding: '2rem' }}>
      {/* Hero Section */}
      <section
        style={{
          textAlign: 'center',
          padding: '4rem 1rem',
          background: '#1a1a2e',
          borderRadius: '12px',
          marginBottom: '3rem',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          AI-Powered Robotics Marketplace
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#ccc', marginBottom: '2rem' }}>
          Discover cutting-edge robots for education, research, and innovation.
        </p>
        <Link
          to="/products"
          style={{
            background: '#4f46e5',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Browse Catalogue
        </Link>
      </section>

      {/* Category Shortcuts */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Shop by Category</h2>
        {categoriesLoading ? (
          <p>Loading categories...</p>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                style={{
                  background: '#242424',
                  color: 'white',
                  padding: '1rem 1.5rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  border: '1px solid #444',
                }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section>
        <h2 style={{ marginBottom: '1rem' }}>Featured Products</h2>
        {productsLoading ? (
          <p>Loading products...</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {featuredProducts.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                style={{
                  background: '#242424',
                  borderRadius: '8px',
                  padding: '1rem',
                  textDecoration: 'none',
                  color: 'white',
                  border: '1px solid #333',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '150px',
                    background: '#333',
                    borderRadius: '6px',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ color: '#888' }}>No Image</span>
                  )}
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                  {product.name}
                </h3>
                <p style={{ color: '#aaa' }}>Rs. {product.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;