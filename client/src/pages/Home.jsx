import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import { fetchProducts } from '../redux/slices/productSlice';

export default function Home() {
  const dispatch = useDispatch();
  const { items: products, loading: productsLoading } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts({ sort: '-createdAt' }));
    // Categories are fetched once, globally, in Layout.jsx — no need to
    // duplicate that dispatch here now that the "Shop by Category" section
    // has been removed from Home.
  }, [dispatch]);

  const featured = products.slice(0, 4);

  return (
    <div className="flex flex-col gap-14 py-8 sm:py-12">
      <Hero />
      <FeaturedProducts products={featured} loading={productsLoading} />
    </div>
  );
}
