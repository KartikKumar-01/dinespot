import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80';

export default function RestaurantCard({ restaurant }) {
  const { slug, name, cuisine, priceRange, rating, reviewCount, location, image, tags = [] } = restaurant;

  return (
    <Link
      to={`/restaurants/${slug}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={image || FALLBACK_IMG}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = FALLBACK_IMG; }}
        />
        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full text-gray-800 shadow-sm">
          {priceRange}
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 text-lg leading-snug mb-1 group-hover:text-[#C9A96E] transition-colors truncate">
          {name}
        </h3>

        <p className="text-sm text-gray-500 mb-3">{cuisine}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold text-gray-800">{rating?.toFixed(1)}</span>
          <span className="text-xs text-gray-400">({reviewCount} reviews)</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-500 mb-3">
          <MapPin size={13} className="flex-shrink-0" />
          <span className="text-xs truncate">{location}</span>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
