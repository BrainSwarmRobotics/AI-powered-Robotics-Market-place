// note: this is temporary
// for testing
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';

function Home() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <h1 style={{ color: 'white' }}>Loading...</h1>;
  if (error) return <h1 style={{ color: 'red' }}>Error: {error}</h1>;

  return (
    <div style={{ color: 'white' }}>
      <h1>Home Page</h1>
      <p>Total products fetched: {items.length}</p>
      <ul>
        {items.map((product) => (
          <li key={product._id}>{product.name} — Rs. {product.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default Home;