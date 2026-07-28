import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, UtensilsCrossed, CheckCircle2, XCircle,
  Clock, TrendingUp, ChevronRight, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import useOwnerStore from '../../store/ownerStore';
import useAuthStore from '../../store/authStore';
import { formatDate, formatTime, getStatusColor } from '../../utils/formatters';

export default function OwnerDashboardPage() {
  const { user } = useAuthStore();
  const { restaurant, bookings, loading, fetchRestaurant, fetchBookings } = useOwnerStore();

  useEffect(() => {
    fetchRestaurant();
    fetchBookings();
  }, []);

  const total = bookings.length;
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
  const completed = bookings.filter((b) => b.status === 'completed').length;
  const cancelled = bookings.filter((b) => b.status === 'cancelled').length;
  const recent = [...bookings].slice(0, 6);

  const stats = [
    { label: 'Total Bookings', value: total, icon: CalendarDays, color: 'bg-blue-50 text-blue-600' },
    { label: 'Confirmed', value: confirmed, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Completed', value: completed, icon: TrendingUp, color: 'bg-amber-50 text-amber-600' },
    { label: 'Cancelled', value: cancelled, icon: XCircle, color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl text-gray-900">
          Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening with your restaurant today.</p>
      </div>

      {/* Restaurant status banner */}
      {loading ? (
        <Skeleton className="h-20 rounded-2xl" />
      ) : !restaurant ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4">
          <AlertCircle className="text-amber-600 flex-shrink-0" size={24} />
          <div className="flex-1">
            <p className="font-semibold text-amber-800">No restaurant registered yet</p>
            <p className="text-amber-700 text-sm">Create your restaurant profile to start accepting bookings.</p>
          </div>
          <Button asChild size="sm" className="bg-[#C9A96E] hover:bg-[#A8854A] text-white shrink-0">
            <Link to="/owner/restaurant">Get Started</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            {restaurant.image
              ? <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
              : <UtensilsCrossed className="w-full h-full p-4 text-gray-300" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-lg truncate">{restaurant.name}</p>
            <p className="text-sm text-gray-500 truncate">{restaurant.cuisine} · {restaurant.location}</p>
          </div>
          <Badge
            className={
              restaurant.status === 'approved'
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                : restaurant.status === 'pending'
                ? 'bg-amber-100 text-amber-700 border-amber-200'
                : 'bg-red-100 text-red-700 border-red-200'
            }
          >
            {restaurant.status}
          </Badge>
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <Link to="/owner/restaurant">
              Manage <ChevronRight size={14} className="ml-1" />
            </Link>
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-gray-100 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon size={18} />
              </div>
              {loading ? (
                <Skeleton className="h-8 w-16 mb-1" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{value}</p>
              )}
              <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent bookings */}
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="font-serif text-xl text-gray-900">Recent Bookings</CardTitle>
          <Button asChild variant="ghost" size="sm" className="text-[#C9A96E] hover:text-[#A8854A] text-xs">
            <Link to="/owner/bookings">View all <ChevronRight size={12} className="ml-1" /></Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <CalendarDays size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No bookings yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recent.map((b) => (
                <div key={b._id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#C9A96E] font-bold text-sm">
                      {b.user?.name?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{b.user?.name}</p>
                    <p className="text-xs text-gray-400">{formatDate(b.date)} · {formatTime(b.time)} · {b.guests} guests</p>
                  </div>
                  <Badge className={`text-xs border ${getStatusColor(b.status)}`}>
                    {b.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
