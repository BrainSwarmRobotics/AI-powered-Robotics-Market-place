import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import { Eye, Star, MessageSquare, TrendingUp } from 'lucide-react';
import {
  fetchAnalyticsSummary,
  fetchSalesAnalytics,
  fetchTopProducts,
  setAnalyticsPeriod,
  setTopProductsSortBy,
} from '../../redux/slices/adminAnalyticsSlice';

function formatCurrency(n) {
  return `Rs ${Number(n || 0).toLocaleString('en-PK')}`;
}

function SummaryCard({ label, value, sub }) {
  return (
    <div className="rounded-panel border border-neutral-200 bg-surface p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-600">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-neutral-600">{sub}</p>}
    </div>
  );
}

function PlaceholderCard({ icon: Icon, label, note }) {
  return (
    <div className="rounded-panel border border-dashed border-neutral-200 bg-surface-alt p-5">
      <Icon size={18} className="text-neutral-400" />
      <p className="mt-2 text-sm font-semibold text-neutral-600">{label}</p>
      <p className="mt-1 text-xs text-neutral-400">{note}</p>
    </div>
  );
}

export default function AdminAnalytics() {
  const dispatch = useDispatch();
  const {
    summary,
    summaryLoading,
    period,
    salesData,
    salesLoading,
    topProductsSortBy,
    topProducts,
    topProductsLoading,
  } = useSelector((state) => state.adminAnalytics);

  useEffect(() => {
    dispatch(fetchAnalyticsSummary());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSalesAnalytics({ period }));
  }, [dispatch, period]);

  useEffect(() => {
    dispatch(fetchTopProducts({ sortBy: topProductsSortBy, limit: 10 }));
  }, [dispatch, topProductsSortBy]);

  const revenueChangeLabel =
    summary?.revenueChangePct === null || summary?.revenueChangePct === undefined
      ? 'No data last month to compare'
      : `${summary.revenueChangePct > 0 ? '+' : ''}${summary.revenueChangePct}% vs last month`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink">Analytics</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Revenue and product performance, computed from paid and COD orders.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Total revenue"
          value={summaryLoading ? '—' : formatCurrency(summary?.totalRevenue)}
          sub={summaryLoading ? '' : revenueChangeLabel}
        />
        <SummaryCard
          label="Total orders"
          value={summaryLoading ? '—' : summary?.totalOrders ?? 0}
          sub={summaryLoading ? '' : `${summary?.ordersThisMonth ?? 0} this month`}
        />
        <SummaryCard
          label="Avg order value"
          value={summaryLoading ? '—' : formatCurrency(summary?.avgOrderValue)}
        />
        <SummaryCard
          label="Pending refund requests"
          value={summaryLoading ? '—' : summary?.pendingRefundRequests ?? 0}
          sub="Needs review in Orders"
        />
      </div>

      <div className="rounded-panel border border-neutral-200 bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">Revenue over time</h2>
          <div className="flex gap-1 rounded-control bg-surface-alt p-1">
            {['daily', 'weekly', 'monthly'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => dispatch(setAnalyticsPeriod(p))}
                className={`rounded-control px-3 py-1 text-xs font-medium capitalize transition-colors ${
                  period === p ? 'bg-accent text-white' : 'text-neutral-600 hover:text-ink'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {salesLoading ? (
          <div className="flex h-64 items-center justify-center text-sm text-neutral-600">Loading chart…</div>
        ) : salesData.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-neutral-600">
            No orders in this window yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral-200)" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="var(--color-neutral-400)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--color-neutral-400)" />
              <Tooltip
                formatter={(value, name) => (name === 'revenue' ? formatCurrency(value) : value)}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-accent)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="rounded-panel border border-neutral-200 bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">Top products</h2>
          <div className="flex gap-1 rounded-control bg-surface-alt p-1">
            {[
              { key: 'revenue', label: 'By revenue' },
              { key: 'units', label: 'By units' },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => dispatch(setTopProductsSortBy(key))}
                className={`rounded-control px-3 py-1 text-xs font-medium transition-colors ${
                  topProductsSortBy === key ? 'bg-accent text-white' : 'text-neutral-600 hover:text-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {topProductsLoading ? (
          <div className="flex h-64 items-center justify-center text-sm text-neutral-600">Loading…</div>
        ) : topProducts.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-neutral-600">
            No sales data yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(240, topProducts.length * 36)}>
            <BarChart data={topProducts} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral-200)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--color-neutral-400)" />
              <YAxis
                type="category"
                dataKey="name"
                width={160}
                tick={{ fontSize: 11 }}
                stroke="var(--color-neutral-400)"
              />
              <Tooltip
                formatter={(value) =>
                  topProductsSortBy === 'revenue' ? formatCurrency(value) : value
                }
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar
                dataKey={topProductsSortBy === 'revenue' ? 'revenue' : 'unitsSold'}
                fill="var(--color-accent-teal)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-ink">Not available yet</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <PlaceholderCard icon={Eye} label="Most viewed" note="Needs product view tracking — not built yet." />
          <PlaceholderCard icon={MessageSquare} label="Most reviewed" note="Ships with reviews in D1." />
          <PlaceholderCard icon={Star} label="Highest rated" note="Ships with reviews in D1." />
          <PlaceholderCard icon={TrendingUp} label="Conversion rate" note="Needs session/visit tracking — not built yet." />
        </div>
      </div>
    </div>
  );
}