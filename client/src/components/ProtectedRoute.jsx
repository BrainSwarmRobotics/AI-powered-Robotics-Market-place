import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Route guard. Wrap a subtree that needs a logged-in user, optionally
 * restricted to specific roles.
 *
 *   <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
 *     <Route path="/admin" element={<AdminLayout />}>...</Route>
 *   </Route>
 *
 * Omit allowedRoles to just require any logged-in user (e.g. for /orders,
 * /checkout, if those get gated later) without restricting by role.
 *
 * ASSUMPTION: state.auth.user.role is populated from the login/register
 * API response (authSlice's persistSession spreads the response minus
 * token/success into user). If authController.js doesn't return `role`
 * in that payload, this check silently fails closed — worth a quick
 * confirm against the actual response shape.
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}