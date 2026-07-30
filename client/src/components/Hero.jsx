import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section style={{ textAlign: 'center', padding: '4rem 1rem', background: '#1a1a2e', borderRadius: '12px', marginBottom: '3rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>AI-Powered Robotics Marketplace</h1>
      <p style={{ fontSize: '1.1rem', color: '#ccc', marginBottom: '2rem' }}>
        Discover cutting-edge robots for education, research, and innovation.
      </p>
      <Link to="/products" style={{ background: '#4f46e5', color: 'white', padding: '0.75rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
        Browse Catalogue
      </Link>
    </section>
  );
}

export default Hero;