import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, Users, MapPin, X, UtensilsCrossed, AlertCircle } from 'lucide-react';
import { useBookings } from '../hooks/useBookings';
import { formatDate, formatTime, getStatusColor } from '../utils/formatters';
import { BookingCardSkeleton } from '../components/LoadingSkeleton';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80';

export default function BookingsPage() {
  const { bookings, loading, error, fetchMyBookings, cancelBooking } = useBookings();
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelError, setCancelError] = useState('');

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(id);
    setCancelError('');
    const result = await cancelBooking(id);
    if (!result.success) setCancelError(result.message);
    setCancellingId(null);
  };

  const upcoming = bookings.filter((b) => b.status === 'confirmed');
  const past = bookings.filter((b) => b.status !== 'confirmed');

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-500 text-sm">Manage your dining reservations</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {cancelError && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 flex items-center gap-3 text-sm text-red-600">
            <AlertCircle size={16} /> {cancelError}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => <BookingCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-gray-500">
            <AlertCircle size={40} className="mx-auto mb-4 text-red-400" />
            <p>{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarDays size={40} className="text-gray-300" />
            </div>
            <h3 className="font-semibold text-xl text-gray-700 mb-2">No bookings yet</h3>
            <p className="text-gray-400 text-sm mb-6">Discover restaurants and make your first reservation.</p>
            <Link
              to="/restaurants"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A96E] text-white rounded-full text-sm font-semibold hover:bg-[#A8854A] transition-all"
            >
              <UtensilsCrossed size={15} /> Explore Restaurants
            </Link>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <section>
                <h2 className="font-semibold text-sm uppercase tracking-widest text-gray-400 mb-5">
                  Upcoming ({upcoming.length})
                </h2>
                <div className="space-y-4">
                  {upcoming.map((booking) => (
                    <BookingCard
                      key={booking._id}
                      booking={booking}
                      onCancel={handleCancel}
                      cancelling={cancellingId === booking._id}
                    />
                  ))}
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section>
                <h2 className="font-semibold text-sm uppercase tracking-widest text-gray-400 mb-5">
                  Past & Cancelled ({past.length})
                </h2>
                <div className="space-y-4 opacity-75">
                  {past.map((booking) => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking, onCancel, cancelling }) {
  const { _id, restaurant, date, time, guests, status, occasion, bookingId } = booking;
  const statusClass = getStatusColor(status);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-32 h-32 sm:h-auto flex-shrink-0 overflow-hidden">
          <img
            src={restaurant?.image || FALLBACK_IMG}
            alt={restaurant?.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = FALLBACK_IMG; }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg mb-0.5">
                <Link
                  to={`/restaurants/${restaurant?.slug}`}
                  className="hover:text-[#C9A96E] transition-colors"
                >
                  {restaurant?.name}
                </Link>
              </h3>
              {bookingId && (
                <p className="text-xs text-gray-400 font-mono mb-2">{bookingId}</p>
              )}
              <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full border ${statusClass}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>

            {onCancel && status === 'confirmed' && (
              <button
                onClick={() => onCancel(_id)}
                disabled={cancelling}
                className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-full transition-all disabled:opacity-50"
              >
                <X size={12} /> {cancelling ? 'Cancelling...' : 'Cancel'}
              </button>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <InfoPill icon={CalendarDays} value={formatDate(date)} />
            <InfoPill icon={Clock} value={formatTime(time)} />
            <InfoPill icon={Users} value={`${guests} guest${guests !== 1 ? 's' : ''}`} />
            {restaurant?.location && <InfoPill icon={MapPin} value={restaurant.location} />}
          </div>

          {occasion && (
            <p className="mt-3 text-xs text-gray-400">
              <span className="font-medium text-gray-500">Occasion:</span> {occasion}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoPill({ icon: Icon, value }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
      <Icon size={12} className="text-[#C9A96E] flex-shrink-0" />
      <span className="truncate">{value}</span>
    </div>
  );
}
