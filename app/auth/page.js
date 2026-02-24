"use client";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../src/context/AuthContext";
import Footer from "../../components/Footer";


// Google Icon (unchanged)
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
    <path fill="#fbc02d" d="M43.6 20.4H24v7.7h11.2c-.6 3.1-2.9 5.8-5.9 7.6l2.3 2.1c3.5-3.3 5.4-8 5.4-13.4V20.4z" />
    <path fill="#e53935" d="M24 44c5.7 0 10.7-1.9 14.2-5.1l-3-2.3c-1.9 1.4-4.5 2.3-7.7 2.3-5.9 0-10.9-4-12.7-9.4L8 31.7c2.2 4.4 6.7 7.7 12 8.7V44z" />
    <path fill="#4caf50" d="M11.3 26.6c-.3-1.4-.4-2.8-.4-4.2s.1-2.8.4-4.2L8 15.9c-.3 1.5-.5 3-.5 4.9s.2 3.4.5 4.9l3.3 1.7z" />
    <path fill="#1565c0" d="M24 11.2c3.1 0 5.8 1.1 8 3.3l2.7-2.7c-3.1-3.1-7.2-5.4-12.7-5.4-4.5 0-8.8 1.4-12.5 4.1l3.2 2.5c1.8-1.5 4.1-2.4 7-2.4z" />
  </svg>
);

// Social Login Block (unchanged)
const SocialLoginBlock = () => (
  <div className="space-y-3 mb-6">
    <button
      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150 shadow-sm"
      onClick={() => alert("Google login coming soon!")}
    >
      <GoogleIcon />
      Continue with Google
    </button>
  </div>
);

// Login Form (unchanged)
const LoginPage = ({ switchToSignup }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, refetchUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      await refetchUser();
      setTimeout(() => {
        window.location.href = '/';
      }, 300);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center lg:text-left">
        Log In
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-pulse">
          {error}
        </div>
      )}

      <SocialLoginBlock />

      <div className="flex justify-between items-center my-6 text-sm">
        <div className="text-gray-500 font-medium">OR</div>
        <Link href="/forgot-password" className="font-medium text-gray-800 hover:text-gray-600">
          Forgot Password?
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div className="relative">
          <input
            type="email"
            id="login-email"
            placeholder=" "
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={loading}
            className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800 focus:ring-0 transition-all bg-white placeholder-transparent"
          />
          <label
            htmlFor="login-email"
            className="absolute left-4 -top-2.5 px-1 bg-white text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-800"
          >
            Email Address
          </label>
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="login-password"
            placeholder=" "
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            disabled={loading}
            className="peer w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800 focus:ring-0 transition-all bg-white placeholder-transparent"
          />
          <label
            htmlFor="login-password"
            className="absolute left-4 -top-2.5 px-1 bg-white text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-800"
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {showPassword ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              )}
            </svg>
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition duration-150 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 lg:text-left">
        Don't have an account?{' '}
        <button onClick={switchToSignup} className="font-medium text-gray-800 hover:text-gray-600">
          Sign Up
        </button>
      </p>
    </div>
  );
};

// Signup Form (fixed popup - only shows after signup, not on reload)
const SignupPage = ({ switchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // ← Only in-memory, no localStorage
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { signup } = useAuth();
  const router = useRouter();

  // Real-time password strength
  useEffect(() => {
    const pwd = formData.password;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  }, [formData.password]);

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-orange-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowSuccessPopup(false);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreed) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (passwordStrength < 3) {
      setError('Password is too weak. Please make it stronger.');
      return;
    }

    setLoading(true);

    try {
      await signup(formData.name.trim(), formData.email.trim(), formData.password);
      setShowSuccessPopup(true); // Show popup only after success
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center lg:text-left">
        Create Account
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-pulse">
          {error}
        </div>
      )}

      <SocialLoginBlock />

      <div className="relative flex justify-center items-center my-6">
        <div className="absolute w-full border-t border-gray-200"></div>
        <span className="relative bg-white px-3 text-sm font-medium text-gray-500">
          OR
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="relative">
          <input
            type="text"
            id="signup-name"
            placeholder=" "
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={loading}
            className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800 focus:ring-0 transition-all bg-white placeholder-transparent"
          />
          <label
            htmlFor="signup-name"
            className="absolute left-4 -top-2.5 px-1 bg-white text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-800"
          >
            Full Name
          </label>
        </div>

        {/* Email */}
        <div className="relative">
          <input
            type="email"
            id="signup-email"
            placeholder=" "
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={loading}
            className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800 focus:ring-0 transition-all bg-white placeholder-transparent"
          />
          <label
            htmlFor="signup-email"
            className="absolute left-4 -top-2.5 px-1 bg-white text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-800"
          >
            Email Address
          </label>
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="signup-password"
            placeholder=" "
            required
            minLength={8}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            disabled={loading}
            className="peer w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800 focus:ring-0 transition-all bg-white placeholder-transparent"
          />
          <label
            htmlFor="signup-password"
            className="absolute left-4 -top-2.5 px-1 bg-white text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-800"
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {showPassword ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              )}
            </svg>
          </button>
        </div>

        {formData.password && (
          <div className="mt-1">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                style={{ width: `${passwordStrength * 25}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {passwordStrength <= 1 && "Very weak"}
              {passwordStrength === 2 && "Weak"}
              {passwordStrength === 3 && "Good"}
              {passwordStrength === 4 && "Strong"}
            </p>
          </div>
        )}

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="signup-confirm-password"
            placeholder=" "
            required
            minLength={8}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            disabled={loading}
            className="peer w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800 focus:ring-0 transition-all bg-white placeholder-transparent"
          />
          <label
            htmlFor="signup-confirm-password"
            className="absolute left-4 -top-2.5 px-1 bg-white text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-800"
          >
            Confirm Password
          </label>
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {showConfirmPassword ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              )}
            </svg>
          </button>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            disabled={loading}
            className="h-4 w-4 text-gray-800 focus:ring-gray-800 border-gray-300 rounded mt-1"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            I agree to the{" "}
            <Link href="/terms" className="font-medium text-gray-800 hover:text-gray-600">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-gray-800 hover:text-gray-600">
              Privacy Policy
            </Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !agreed}
          className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition duration-150 shadow-md ${
            agreed && !loading
              ? "bg-gray-800 hover:bg-gray-900 focus:ring-gray-800"
              : "bg-gray-500 cursor-not-allowed"
          } focus:outline-none focus:ring-2 focus:ring-offset-2`}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 lg:text-left">
        Already have an account?{" "}
        <button
          onClick={switchToLogin}
          className="font-medium text-gray-800 hover:text-gray-600 focus:outline-none"
        >
          Log In
        </button>
      </p>

      {/* TEMPORARY SUCCESS POPUP - only shows right after signup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] backdrop-blur-md">
          <div className="bg-white rounded-3xl p-10 max-w-lg w-full mx-4 shadow-2xl text-center border border-gray-200">
            <h2 className="text-3xl font-bold text-[#001d3d] mb-6">Verify Your Email</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Your account is created! Please check your inbox ({formData.email || 'your email'}) and click the verification link to activate your account.
            </p>
            <p className="text-sm text-gray-500">
              This message will disappear after verification. You can close this tab.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Auth Page (handles verification redirect)
function AuthContent() {
  const [isLoginView, setIsLoginView] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refetchUser } = useAuth();

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      refetchUser();
      setTimeout(() => {
        window.location.href = '/';
      }, 800);
    }
  }, [searchParams, refetchUser]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow flex items-center justify-center py-36 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full bg-white shadow-2xl rounded-xl overflow-hidden hidden lg:grid lg:grid-cols-2">
          <div className="flex flex-col items-center justify-center p-10 bg-gray-800 text-white min-h-full">
            <h1 className="text-4xl text-center font-extrabold font-sans mb-10 tracking-wide">
              CheAura Travels
            </h1>
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">
                {isLoginView ? "Welcome Back" : "Start Your Journey"}
              </h2>
              <p className="text-lg opacity-90 font-light">
                {isLoginView
                  ? "Log in to continue your secure journey."
                  : "Create your professional account to unlock all features."}
              </p>
            </div>
          </div>
          <div className="p-10">
            {isLoginView ? (
              <LoginPage switchToSignup={() => setIsLoginView(false)} />
            ) : (
              <SignupPage switchToLogin={() => setIsLoginView(true)} />
            )}
          </div>
        </div>

        <div className="max-w-md w-full space-y-8 bg-white p-10 shadow-xl rounded-xl lg:hidden">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold font-sans text-gray-800">
              CheAura Travels
            </h1>
          </div>
          {isLoginView ? (
            <LoginPage switchToSignup={() => setIsLoginView(false)} />
          ) : (
            <SignupPage switchToLogin={() => setIsLoginView(true)} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-800 text-xl font-semibold animate-pulse">Loading...</div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}