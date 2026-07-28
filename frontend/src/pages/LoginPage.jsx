import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, UtensilsCrossed, Loader2, AlertCircle } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const { login, loading } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPass, setShowPass] = useState(false);
  const [apiError, setApiError] = useState('');

  const onSubmit = async (data) => {
    setApiError('');
    const result = await login(data);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setApiError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80"
          alt="Fine dining"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-[#1A0E00]/60" />
        <div className="relative z-10 flex flex-col justify-end p-14 text-white">
          <Link to="/" className="flex items-center gap-2.5 mb-auto pt-10">
            <div className="w-9 h-9 bg-[#C9A96E] rounded-full flex items-center justify-center">
              <UtensilsCrossed size={18} className="text-white" />
            </div>
            <span className="font-serif text-2xl font-semibold">DineSpot</span>
          </Link>
          <blockquote className="font-serif text-3xl leading-snug mb-6">
            "The discovery of a new dish does more for human happiness than the discovery of a new star."
          </blockquote>
          <p className="text-white/60 text-sm">— Jean Anthelme Brillat-Savarin</p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-[#C9A96E] rounded-full flex items-center justify-center">
              <UtensilsCrossed size={16} className="text-white" />
            </div>
            <span className="font-serif text-xl font-semibold text-gray-900">DineSpot</span>
          </Link>

          <h1 className="font-serif text-4xl text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">Sign in to your account to continue</p>

          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-red-600 mb-6">
              <AlertCircle size={16} className="flex-shrink-0" />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className={`w-full px-4 py-3.5 rounded-xl border text-sm bg-white focus:outline-none focus:border-[#C9A96E] transition-all ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                })}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full px-4 py-3.5 pr-12 rounded-xl border text-sm bg-white focus:outline-none focus:border-[#C9A96E] transition-all ${errors.password ? 'border-red-300' : 'border-gray-200'}`}
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#C9A96E] text-white font-bold rounded-xl hover:bg-[#A8854A] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm shadow-md"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#C9A96E] font-semibold hover:text-[#A8854A]">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
