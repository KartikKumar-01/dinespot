import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Star, Clock, ChefHat, Tag, ArrowLeft,
  CalendarDays, Users, UtensilsCrossed, AlertCircle
} from 'lucide-react';
import { getRestaurantBySlug } from '../api/restaurantApi';
import useAuthStore from '../store/authStore';
import BookingModal from '../components/BookingModal';
import StarRating from '../components/StarRating';
import { formatPrice } from '../utils/formatters';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80';

export default function RestaurantDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getRestaurantBySlug(slug);
        setRestaurant(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Restaurant not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const handleBookClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/restaurants/${slug}` } });
    } else {
      setShowBooking(true);
    }
  };

  if (loading) return <DetailSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-gray-800 mb-2">{error}</h2>
          <button onClick={() => navigate('/restaurants')} className="mt-4 text-sm text-[#C9A96E] hover:underline">
            ← Back to Restaurants
          </button>
        </div>
      </div>
    );
  }

  const { name, cuisine, priceRange, rating, reviewCount, location, address, description, chef, tags = [], availableSlots = [], image } = restaurant;

  return (
    <>
      <div className="min-h-screen bg-[#FAFAF8]">
        {/* Hero */}
        <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
          <img
            src={image || FALLBACK_IMG}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = FALLBACK_IMG; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Back btn */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-24 left-6 flex items-center gap-2 text-white/90 hover:text-white text-sm bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full transition-all"
          >
            <ArrowLeft size={16} /> Back
          </button>

          {/* Hero info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 pb-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-[#C9A96E] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {cuisine}
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                  {priceRange} · {formatPrice(priceRange)}
                </span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl text-white mb-3">{name}</h1>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-white">{rating?.toFixed(1)}</span>
                  <span>({reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {location}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left - main info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <section>
                <h2 className="font-serif text-2xl text-gray-900 mb-4">About</h2>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </section>

              {/* Details grid */}
              <section>
                <h2 className="font-serif text-2xl text-gray-900 mb-4">Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailRow icon={ChefHat} label="Head Chef" value={chef} />
                  <DetailRow icon={MapPin} label="Address" value={address} />
                  <DetailRow icon={Star} label="Rating" value={`${rating?.toFixed(1)} / 5 (${reviewCount} reviews)`} />
                  <DetailRow icon={Tag} label="Price" value={`${priceRange} · ${formatPrice(priceRange)}`} />
                </div>
              </section>

              {/* Tags */}
              {tags.length > 0 && (
                <section>
                  <h2 className="font-serif text-2xl text-gray-900 mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag} className="px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Available times */}
              {availableSlots.length > 0 && (
                <section>
                  <h2 className="font-serif text-2xl text-gray-900 mb-4">
                    <Clock size={20} className="inline mr-2 text-[#C9A96E]" />
                    Available Timings
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {availableSlots.map((slot) => (
                      <div
                        key={slot}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm text-gray-700 shadow-sm"
                      >
                        <Clock size={13} className="text-[#C9A96E]" />
                        {slot}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right - booking CTA */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
                <StarRating rating={rating} />
                <p className="text-xs text-gray-400 mt-1 mb-6">{reviewCount} reviews</p>

                <div className="space-y-3 mb-6 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <MapPin size={15} className="text-[#C9A96E] flex-shrink-0" />
                    <span>{address}</span>
                  </div>
                  {availableSlots.length > 0 && (
                    <div className="flex items-center gap-3">
                      <Clock size={15} className="text-[#C9A96E] flex-shrink-0" />
                      <span>{availableSlots[0]} – {availableSlots[availableSlots.length - 1]}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Users size={15} className="text-[#C9A96E] flex-shrink-0" />
                    <span>Up to {restaurant.totalSeats || 20} guests per slot</span>
                  </div>
                </div>

                <button
                  id="book-table-btn"
                  onClick={handleBookClick}
                  className="w-full py-4 bg-[#C9A96E] text-white font-bold rounded-xl hover:bg-[#A8854A] transition-all flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg"
                >
                  <CalendarDays size={16} />
                  Book a Table
                </button>

                {!isAuthenticated && (
                  <p className="text-xs text-center text-gray-400 mt-3">
                    You'll be redirected to sign in
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBooking && (
        <BookingModal restaurant={restaurant} onClose={() => setShowBooking(false)} />
      )}
    </>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100">
      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-[#C9A96E]" />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-sm text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="skeleton h-[55vh]" />
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <div className="skeleton h-8 w-1/2 rounded-xl" />
        <div className="skeleton h-4 w-full rounded-lg" />
        <div className="skeleton h-4 w-3/4 rounded-lg" />
        <div className="grid grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}
        </div>
      </div>
    </div>
  );
}
