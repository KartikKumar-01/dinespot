import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, MapPin, CalendarDays, Star, ArrowRight,
  Shield, Clock, Award, ChevronRight, UtensilsCrossed,
  Flame, Leaf, Fish, Coffee, Cake, Pizza
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useRestaurantStore from '../store/restaurantStore';
import RestaurantCard from '../components/RestaurantCard';
import { RestaurantCardSkeleton } from '../components/LoadingSkeleton';

const HERO_IMG = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=90';

const CUISINES = [
  { name: 'Italian', icon: Pizza },
  { name: 'Sushi', icon: Fish },
  { name: 'French', icon: UtensilsCrossed },
  { name: 'Steakhouse', icon: Flame },
  { name: 'Vegetarian', icon: Leaf },
  { name: 'Cafe', icon: Coffee },
  { name: 'Desserts', icon: Cake },
];

const WHY_US = [
  { icon: Shield, title: 'Curated Selection', desc: 'Every restaurant is personally vetted by our culinary experts for exceptional quality.' },
  { icon: Clock, title: 'Instant Confirmation', desc: 'Your reservation is confirmed in seconds, with real-time availability.' },
  { icon: Award, title: 'Exclusive Experiences', desc: 'Access to chef\'s tables, tasting menus, and private dining rooms.' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { featuredRestaurants, getFeaturedRestaurants, loading } = useRestaurantStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    getFeaturedRestaurants();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (searchLocation) params.set('location', searchLocation);
    if (searchDate) params.set('date', searchDate);
    navigate(`/restaurants?${params.toString()}`);
  };

  return (
    <>
      <section className="relative h-screen min-h-[600px] flex flex-col">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={HERO_IMG}
            alt="Fine dining"
            className={`w-full h-full object-cover transition-opacity duration-700 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setHeroLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="relative flex-1 flex flex-col items-center justify-center text-center px-4 pt-16">
          <p className="text-[#C9A96E] text-xs font-bold tracking-[0.3em] uppercase mb-5">
            Exquisite Dining Experiences
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white font-medium leading-tight mb-6 max-w-4xl">
            Curation for the<br />Discerning Palate
          </h1>
          <p className="text-white/75 text-lg max-w-xl mb-12 leading-relaxed">
            Discover handpicked restaurants offering unforgettable culinary journeys.
          </p>

          {!isAuthenticated && (
            <div className="flex gap-3 mb-10">
              <Link
                to="/login"
                className="px-6 py-3 border border-white/50 text-white rounded-full text-sm font-medium hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-[#C9A96E] text-white rounded-full text-sm font-semibold hover:bg-[#A8854A] transition-all shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
          {isAuthenticated && (
            <p className="text-white/80 text-sm mb-10">
              Welcome back, <strong className="text-[#C9A96E]">{user?.name?.split(' ')[0]}</strong> 👋
            </p>
          )}

          <form
            onSubmit={handleSearch}
            className="w-full max-w-4xl glass rounded-2xl shadow-2xl p-3"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-3 bg-white rounded-xl px-4 py-3">
                <Search size={16} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search cuisines, restaurants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
                />
              </div>
              <div className="flex-1 flex items-center gap-3 bg-white rounded-xl px-4 py-3">
                <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Location (e.g. Mumbai)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
                />
              </div>
              <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 min-w-[160px]">
                <CalendarDays size={16} className="text-gray-400 flex-shrink-0" />
                <input
                  type="date"
                  value={searchDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="flex-1 text-sm text-gray-800 outline-none bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-[#C9A96E] text-white font-semibold rounded-xl hover:bg-[#A8854A] transition-all text-sm whitespace-nowrap shadow-md"
              >
                Find a Table
              </button>
            </div>
          </form>
        </div>

        {/* Scroll indicator */}
        <div className="relative flex justify-center pb-8">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── CUISINES ── */}
      <section id="about" className="py-20 px-4 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#C9A96E] text-xs font-bold tracking-widest uppercase mb-3">Curated Selection</p>
              <h2 className="font-serif text-4xl text-gray-900">Browse by Cuisine</h2>
            </div>
            <Link
              to="/restaurants"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#C9A96E] hover:gap-3 transition-all"
            >
              Explore All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {CUISINES.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => navigate(`/restaurants?search=${name}`)}
                className="group flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 hover:border-[#C9A96E] hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-amber-50 group-hover:bg-[#C9A96E] flex items-center justify-center transition-all">
                  <Icon size={22} className="text-[#C9A96E] group-hover:text-white transition-colors" />
                </div>
                <span className="text-xs font-semibold text-gray-600 group-hover:text-[#C9A96E] uppercase tracking-wide transition-colors">
                  {name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED RESTAURANTS ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#C9A96E] text-xs font-bold tracking-widest uppercase mb-3">Currently Trending</p>
              <h2 className="font-serif text-4xl text-gray-900">Trending Fine Dining</h2>
            </div>
            <Link
              to="/restaurants"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#C9A96E] hover:gap-3 transition-all"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => <RestaurantCardSkeleton key={i} />)}
            </div>
          ) : featuredRestaurants.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <UtensilsCrossed size={48} className="mx-auto mb-4 opacity-30" />
              <p>No featured restaurants yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRestaurants.map((r) => (
                <RestaurantCard key={r._id} restaurant={r} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 px-4 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#C9A96E] text-xs font-bold tracking-widest uppercase mb-3">Why DineSpot</p>
            <h2 className="font-serif text-4xl text-gray-900">The DineSpot Difference</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHY_US.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all group">
                <div className="w-14 h-14 bg-amber-50 group-hover:bg-[#C9A96E] rounded-2xl flex items-center justify-center mb-6 transition-all">
                  <Icon size={26} className="text-[#C9A96E] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-xl text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2D2416] rounded-3xl p-14 shadow-2xl">
            <Star size={32} className="text-[#C9A96E] mx-auto mb-6 fill-[#C9A96E]" />
            <h2 className="font-serif text-4xl text-white mb-4">Ready for an Exceptional Evening?</h2>
            <p className="text-gray-400 mb-8 text-lg">Browse hundreds of curated restaurants and book your perfect table in seconds.</p>
            <Link
              to="/restaurants"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A96E] text-white font-semibold rounded-full hover:bg-[#A8854A] transition-all text-lg shadow-lg"
            >
              Explore Restaurants <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
