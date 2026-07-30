import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import { fetchCategories } from '../redux/slices/categorySlice';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';

function Home() {
  const dispatch = useDispatch();

  const { items: products, loading: productsLoading } = useSelector((state) => state.products);
  const { items: categories, loading: categoriesLoading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchProducts({ sort: '-createdAt' }));
    dispatch(fetchCategories());
  }, [dispatch]);

  const featuredProducts = products.slice(0, 4);

  return (
    <div style={{ color: 'white', padding: '2rem' }}>
      <Hero />
      <Categories categories={categories} loading={categoriesLoading} />
      <FeaturedProducts products={featuredProducts} loading={productsLoading} />
    </div>
  );
}

export default Home;