import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../firebase'; // Import auth from your firebase.js file
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const mapAuthError = (code) => {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'Invalid email or password.';
      case 'auth/user-not-found':
        return 'No user found with this email.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later or reset your password.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/network-request-failed':
        return 'Network error. Check your internet connection.';
      default:
        return 'Login failed. Please try again.';
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const pwd = password;
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, trimmedEmail, pwd);
      toast.success('Login Successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate('/home', { replace: true });
    } catch (err) {
      console.error('Login error:', err?.code, err?.message);
      const message = mapAuthError(err?.code);
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgetPassword = async () => {
    if (!email) {
      toast.error('Please enter your email to reset password.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      toast.success('Password reset email sent! Check your inbox.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      console.error('Reset error:', err?.code, err?.message);
      const message = mapAuthError(err?.code);
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="rounded-xl shadow-lg p-8 w-full max-w-md border border-theme bg-surface">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">Login to CampusHub360</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-secondary mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 rounded-lg bg-surface border border-theme text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-secondary mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 rounded-lg bg-surface border border-theme text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
              loading
                ? 'opacity-70 cursor-not-allowed btn-primary'
                : 'btn-primary'
            }`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleForgetPassword}
            className="text-[var(--color-accent)] hover:underline"
          >
            Forgot Password?
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-secondary">
            Don't have an account?{' '}
            <a href="/signup" className="text-[var(--color-accent)] hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
