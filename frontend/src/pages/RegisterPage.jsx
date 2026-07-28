import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, UtensilsCrossed, Loader2, AlertCircle } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, loading } = useAuthStore();

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [showPass, setShowPass] = useState(false);
  const [apiError, setApiError] = useState('');

  const onSubmit = async (data) => {
    setApiError('');
    const { confirmPassword, ...userData } = data;
    const result = await registerUser(userData);
    if (result.success) {
      navigate('/');
    } else {
      setApiError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=900&q=80"
          alt="Restaurant ambiance"
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
          <h2 className="font-serif text-3xl leading-snug mb-4">
            Your next favourite table awaits.
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Join thousands of food lovers who discover and book unforgettable dining experiences every day.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-[#C9A96E] rounded-full flex items-center justify-center">
              <UtensilsCrossed size={16} className="text-white" />
            </div>
            <span className="font-serif text-xl font-semibold text-gray-900">DineSpot</span>
          </Link>

          <h1 className="font-serif text-4xl text-gray-900 mb-2">Create account</h1>
          <p className="text-gray-500 text-sm mb-8">Start your culinary journey today</p>

          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-red-600 mb-6">
              <AlertCircle size={16} className="flex-shrink-0" />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                className={`w-full px-4 py-3.5 rounded-xl border text-sm bg-white focus:outline-none focus:border-[#C9A96E] transition-all ${errors.name ? 'border-red-300' : 'border-gray-200'}`}
                {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone (optional)</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                autoComplete="tel"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#C9A96E] transition-all"
                {...register('phone')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3.5 pr-12 rounded-xl border text-sm bg-white focus:outline-none focus:border-[#C9A96E] transition-all ${errors.password ? 'border-red-300' : 'border-gray-200'}`}
                  {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="Repeat password"
                autoComplete="new-password"
                className={`w-full px-4 py-3.5 rounded-xl border text-sm bg-white focus:outline-none focus:border-[#C9A96E] transition-all ${errors.confirmPassword ? 'border-red-300' : 'border-gray-200'}`}
                {...register('confirmPassword', {
                  required: 'Please confirm password',
                  validate: (val) => val === watch('password') || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#C9A96E] text-white font-bold rounded-xl hover:bg-[#A8854A] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm shadow-md mt-2"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-[#C9A96E] font-semibold hover:text-[#A8854A]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
