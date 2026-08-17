import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, LogOut } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';

export default function AdminTopbar({ onMenuClick }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-surface px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="rounded-control p-2 text-neutral-600 hover:bg-neutral-100 md:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="hidden text-sm text-neutral-600 md:block">
        Signed in as <span className="font-medium text-ink">{user?.name}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="rounded-control bg-accent-soft px-2.5 py-1 text-xs font-medium capitalize text-accent">
          {user?.role}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-control px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-ink"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </header>
  );
}