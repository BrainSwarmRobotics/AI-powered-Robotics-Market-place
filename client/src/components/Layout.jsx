import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchCategories } from '../redux/slices/categorySlice';

export default function Layout() {
  const dispatch = useDispatch();
  const { items: categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    // Nav tabs need categories on every page, not just Home — fetch once
    // here if nothing has loaded them yet.
    if (!categories?.length && !categoriesLoading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories, categoriesLoading]);

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <Navbar categories={categories} />
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
