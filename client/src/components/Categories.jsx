import { Link } from 'react-router-dom';

function Categories({ categories, loading }) {
  return (
    <section style={{ marginBottom: '3rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Shop by Category</h2>
      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              style={{ background: '#242424', color: 'white', padding: '1rem 1.5rem', borderRadius: '8px', textDecoration: 'none', border: '1px solid #444' }}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default Categories;