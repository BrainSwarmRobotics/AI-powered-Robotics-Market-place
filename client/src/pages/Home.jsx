import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import { fetchProducts } from '../redux/slices/productSlice';
import { fetchCategories } from '../redux/slices/categorySlice';

export default function Home() {
  const dispatch = useDispatch();
  const { items: products, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { items: categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    dispatch(fetchProducts({ sort: '-createdAt' }));
    dispatch(fetchCategories());
  }, [dispatch]);

  const featured = products.slice(0, 4);

  return (
    <div className="flex flex-col gap-14 py-8 sm:py-12">
      <Hero />
      <Categories categories={categories} loading={categoriesLoading} />
      <FeaturedProducts products={featured} loading={productsLoading} />
    </div>
  );
}
