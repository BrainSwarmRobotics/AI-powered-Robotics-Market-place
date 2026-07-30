import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: '#1a1a2e',
        color: 'white',
      }}
    >
      <Link
        to="/"
        style={{
          fontSize: '1.3rem',
          fontWeight: 'bold',
          color: 'white',
          textDecoration: 'none',
        }}
      >
        BSR Marketplace
      </Link>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Home
        </Link>
        <Link to="/products" style={{ color: 'white', textDecoration: 'none' }}>
          Products
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;