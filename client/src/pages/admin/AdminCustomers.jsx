import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { fetchCustomers } from '../../redux/slices/adminCustomersSlice';

export default function AdminCustomers() {
  const dispatch = useDispatch();
  const { items, totalUsers, currentPage, totalPages, loading, error } = useSelector(
    (state) => state.adminCustomers
  );
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchCustomers({ search: search || undefined, page }));
  }, [dispatch, search, page]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Customers</h1>
          <p className="mt-1 text-sm text-neutral-600">{totalUsers} total</p>
        </div>

        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search name or email"
            className="rounded-control border border-neutral-200 bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-neutral-400 focus:border-accent"
          />
        </div>
      </div>

      {loading && <p className="mt-6 text-sm text-neutral-600">Loading customers…</p>}
      {error && <p className="mt-6 text-sm text-danger">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 overflow-x-auto rounded-panel border border-neutral-200 bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 text-neutral-600">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u._id} className="border-b border-neutral-200 last:border-0">
                  <td className="px-4 py-3">
                    <Link to={`/admin/customers/${u._id}`} className="font-medium text-ink hover:text-accent">
                      {u.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{u.email}</td>
                  <td className="px-4 py-3 capitalize text-neutral-600">{u.role}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-neutral-600">
                    No customers match that search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-control border border-neutral-200 px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-neutral-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-control border border-neutral-200 px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}