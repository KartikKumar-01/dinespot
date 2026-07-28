import { Link } from 'react-router-dom';
import { User, Mail, Phone, Shield, CalendarDays, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();

  const initial = user?.name?.[0]?.toUpperCase() || '?';

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20">
      <div className="bg-white border-b border-gray-100 py-10 px-4">
        <div className="max-w-2xl mx-auto flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C9A96E] to-[#A8854A] flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-3xl font-bold text-white">{initial}</span>
          </div>
          <div>
            <h1 className="font-serif text-3xl text-gray-900">{user?.name}</h1>
            <p className="text-gray-500 text-sm mt-1 capitalize">{user?.role || 'Member'}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Info card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-widest text-gray-400 mb-2">Account Information</h2>

          <InfoRow icon={User} label="Full Name" value={user?.name} />
          <InfoRow icon={Mail} label="Email Address" value={user?.email} />
          {user?.phone && <InfoRow icon={Phone} label="Phone" value={user.phone} />}
          <InfoRow icon={Shield} label="Account Role" value={user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1) || 'User'} />
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-sm uppercase tracking-widest text-gray-400 mb-5">Quick Links</h2>
          <div className="space-y-2">
            <Link
              to="/bookings"
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-amber-50 hover:text-[#C9A96E] text-gray-700 transition-all group"
            >
              <div className="w-9 h-9 bg-amber-50 group-hover:bg-[#C9A96E] rounded-xl flex items-center justify-center transition-all">
                <CalendarDays size={17} className="text-[#C9A96E] group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="font-medium text-sm">My Bookings</p>
                <p className="text-xs text-gray-400">View and manage your reservations</p>
              </div>
            </Link>
            <Link
              to="/restaurants"
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-amber-50 hover:text-[#C9A96E] text-gray-700 transition-all group"
            >
              <div className="w-9 h-9 bg-amber-50 group-hover:bg-[#C9A96E] rounded-xl flex items-center justify-center transition-all">
                <User size={17} className="text-[#C9A96E] group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="font-medium text-sm">Explore Restaurants</p>
                <p className="text-xs text-gray-400">Discover your next dining experience</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-4 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-all text-sm font-medium"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
      <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-[#C9A96E]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm text-gray-800 font-medium truncate">{value || '—'}</p>
      </div>
    </div>
  );
}
