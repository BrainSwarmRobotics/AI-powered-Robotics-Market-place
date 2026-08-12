import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { registerUser, clearAuthError } from '../redux/slices/authSlice';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError('');
    dispatch(clearAuthError());

    if (password !== confirmPassword) {
      setLocalError("Passwords don't match.");
      return;
    }

    const result = await dispatch(registerUser({ name, email, password }));
    if (registerUser.fulfilled.match(result)) {
      navigate('/account', { replace: true });
    }
  }

  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="mb-1 text-2xl font-semibold text-ink">Create an account</h1>
      <p className="mb-6 text-sm text-neutral-600">Join Brainswarm Robotics.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Name" required value={name} onChange={(e) => setName(e.target.value)} />
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
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="Confirm password"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {(localError || error) && (
          <p className="text-sm text-danger">{localError || error}</p>
        )}
        <Button type="submit" size="md" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-neutral-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-accent">
          Log in
        </Link>
      </p>
    </div>
  );
}
