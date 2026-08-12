import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { loginUser, clearAuthError } from '../redux/slices/authSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      const redirectTo = location.state?.from || '/account';
      navigate(redirectTo, { replace: true });
    }
  }

  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="mb-1 text-2xl font-semibold text-ink">Log in</h1>
      <p className="mb-6 text-sm text-neutral-600">Welcome back to Brainswarm Robotics.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" size="md" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-neutral-600">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-accent">
          Create one
        </Link>
      </p>
    </div>
  );
}
