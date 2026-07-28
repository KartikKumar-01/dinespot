import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, Star, X, UtensilsCrossed } from 'lucide-react';
import useRestaurantStore from '../store/restaurantStore';
import RestaurantCard from '../components/RestaurantCard';
import { RestaurantCardSkeleton } from '../components/LoadingSkeleton';

const PRICE_RANGES = ['$', '$$', '$$$', '$$$$'];
const SORT_OPTIONS = [
  { value: '', label: 'Newest First' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_low', label: 'Price: Low → High' },
  { value: 'price_high', label: 'Price: High → Low' },
];
const RATINGS = [4.5, 4, 3.5, 3];

export default function RestaurantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { restaurants, loading, getRestaurants } = useRestaurantStore();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [priceRange, setPriceRange] = useState([]);
  const [minRating, setMinRating] = useState('');
  const [sort, setSort] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchRestaurants = useCallback(() => {
    const params = {};
    if (search) params.search = search;
    if (location) params.location = location;
    if (sort) params.sort = sort;
    if (minRating) params.rating = minRating;
    if (priceRange.length > 0) params.priceRange = priceRange;
    getRestaurants(params);
  }, [search, location, sort, minRating, priceRange]);

  useEffect(() => {
    fetchRestaurants();
  }, [sort, minRating, priceRange]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRestaurants();
  };

  const togglePrice = (p) => {
    setPriceRange((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setLocation('');
    setPriceRange([]);
    setMinRating('');
    setSort('');
  };

  const activeFilterCount = [
    priceRange.length > 0,
    !!minRating,
    !!location,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-4xl text-gray-900 mb-2">Restaurants</h1>
          <p className="text-gray-500 text-sm">
            {loading ? 'Searching...' : `${restaurants.length} restaurant${restaurants.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search bar row */}
        <form onSubmit={handleSearchSubmit} className="flex gap-3 mb-6 flex-wrap">
          <div className="flex-1 min-w-[200px] flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[#C9A96E] transition-colors">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search restaurants, cuisines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
            />
          </div>
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[#C9A96E] transition-colors">
            <MapPin size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-40 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
            />
          </div>
          <button type="submit" className="px-6 py-3 bg-[#C9A96E] text-white font-semibold rounded-xl hover:bg-[#A8854A] transition-all text-sm">
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
              showFilters ? 'bg-amber-50 border-[#C9A96E] text-[#C9A96E]' : 'bg-white border-gray-200 text-gray-600 hover:border-[#C9A96E]'
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#C9A96E] text-white text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </form>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-800">Filters</h3>
              <button onClick={clearFilters} className="text-xs text-[#C9A96E] hover:underline flex items-center gap-1">
                <X size={12} /> Clear all
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Price */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Price Range</p>
                <div className="flex gap-2 flex-wrap">
                  {PRICE_RANGES.map((p) => (
                    <button
                      key={p}
                      onClick={() => togglePrice(p)}
                      className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${
                        priceRange.includes(p)
                          ? 'bg-[#C9A96E] border-[#C9A96E] text-white'
                          : 'border-gray-200 text-gray-600 hover:border-[#C9A96E]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              {/* Rating */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Min Rating</p>
                <div className="flex gap-2 flex-wrap">
                  {RATINGS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(minRating === String(r) ? '' : String(r))}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                        minRating === String(r)
                          ? 'bg-[#C9A96E] border-[#C9A96E] text-white'
                          : 'border-gray-200 text-gray-600 hover:border-[#C9A96E]'
                      }`}
                    >
                      <Star size={12} className="fill-current" /> {r}+
                    </button>
                  ))}
                </div>
              </div>
              {/* Sort */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Sort By</p>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#C9A96E] transition-colors bg-white"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => <RestaurantCardSkeleton key={i} />)}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UtensilsCrossed size={40} className="text-gray-300" />
            </div>
            <h3 className="font-semibold text-xl text-gray-700 mb-2">No restaurants found</h3>
            <p className="text-gray-400 text-sm mb-6">Try adjusting your search or filters.</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-[#C9A96E] text-white rounded-full text-sm font-semibold hover:bg-[#A8854A] transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {restaurants.map((r) => (
              <RestaurantCard key={r._id} restaurant={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
