import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, max = 5, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-200'}
        />
      ))}
      <span className="ml-1.5 text-sm font-medium text-gray-700">{rating?.toFixed(1)}</span>
    </div>
  );
}
