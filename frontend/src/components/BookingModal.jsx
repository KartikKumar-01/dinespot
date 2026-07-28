import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar, Clock, Users, MessageSquare, Heart, Loader2, CheckCircle } from 'lucide-react';
import { useBookings } from '../hooks/useBookings';
import { getRestaurantAvailability } from '../api/restaurantApi';
import { formatDate } from '../utils/formatters';

const OCCASIONS = ['None', 'Birthday', 'Anniversary', 'Business Dinner', 'Date Night', 'Family Gathering', 'Celebration'];

export default function BookingModal({ restaurant, onClose }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { guests: 2, occasion: 'None' }
  });
  const { createBooking, loading } = useBookings();
  const [availability, setAvailability] = useState([]);
  const [availLoading, setAvailLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const selectedDate = watch('date');

  useEffect(() => {
    if (!selectedDate || !restaurant?._id) return;
    setAvailLoading(true);
    getRestaurantAvailability(restaurant._id, selectedDate)
      .then(setAvailability)
      .catch(() => setAvailability([]))
      .finally(() => setAvailLoading(false));
  }, [selectedDate, restaurant?._id]);

  const onSubmit = async (formData) => {
    setApiError('');
    const result = await createBooking({
      restaurantId: restaurant._id,
      date: formData.date,
      time: formData.time,
      guests: Number(formData.guests),
      occasion: formData.occasion !== 'None' ? formData.occasion : undefined,
      specialRequests: formData.specialRequests || undefined,
    });
    if (result.success) {
      setSuccess(true);
      setTimeout(onClose, 2500);
    } else {
      setApiError(result.message);
    }
  };

  if (success) {
    return (
      <ModalWrapper onClose={onClose}>
        <div className="text-center py-12 px-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <h3 className="font-serif text-2xl text-gray-900 mb-2">Booking Confirmed!</h3>
          <p className="text-gray-500 text-sm">Your table at <strong>{restaurant.name}</strong> on {formatDate(selectedDate)} has been reserved.</p>
        </div>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper onClose={onClose}>
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b border-gray-100">
        <div>
          <h2 className="font-serif text-2xl text-gray-900 mb-1">Reserve a Table</h2>
          <p className="text-sm text-gray-500">{restaurant.name}</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0 mt-1">
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        {/* Date + Guests */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              <Calendar size={12} className="inline mr-1" />Date
            </label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 focus:outline-none focus:border-[#C9A96E] focus:bg-white transition-all ${errors.date ? 'border-red-300' : 'border-gray-200'}`}
              {...register('date', { required: 'Date required' })}
            />
            {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              <Users size={12} className="inline mr-1" />Guests
            </label>
            <input
              type="number"
              min={1}
              max={20}
              className={`w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 focus:outline-none focus:border-[#C9A96E] focus:bg-white transition-all ${errors.guests ? 'border-red-300' : 'border-gray-200'}`}
              {...register('guests', { required: 'Required', min: { value: 1, message: 'Min 1' }, max: { value: 20, message: 'Max 20' } })}
            />
            {errors.guests && <p className="text-xs text-red-500 mt-1">{errors.guests.message}</p>}
          </div>
        </div>

        {/* Time slots */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            <Clock size={12} className="inline mr-1" />Time Slot
          </label>
          {!selectedDate ? (
            <p className="text-xs text-gray-400 italic">Select a date to see available times</p>
          ) : availLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 size={14} className="animate-spin" /> Loading slots...
            </div>
          ) : availability.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No availability data for this date.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availability.map((slot) => (
                <label
                  key={slot.time}
                  className={`relative cursor-pointer ${!slot.isAvailable ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    value={slot.time}
                    disabled={!slot.isAvailable}
                    className="sr-only peer"
                    {...register('time', { required: 'Select a time' })}
                  />
                  <div className="text-center text-xs py-2.5 px-2 rounded-xl border border-gray-200 peer-checked:border-[#C9A96E] peer-checked:bg-amber-50 peer-checked:text-[#C9A96E] peer-checked:font-semibold hover:border-[#C9A96E] transition-all">
                    {slot.time}
                    <div className="text-[10px] text-gray-400 mt-0.5">{slot.availableSeats} left</div>
                  </div>
                </label>
              ))}
            </div>
          )}
          {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time.message}</p>}
        </div>

        {/* Occasion */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            <Heart size={12} className="inline mr-1" />Occasion
          </label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:border-[#C9A96E] focus:bg-white transition-all"
            {...register('occasion')}
          >
            {OCCASIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            <MessageSquare size={12} className="inline mr-1" />Special Requests
          </label>
          <textarea
            rows={3}
            placeholder="Dietary restrictions, seating preferences..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:border-[#C9A96E] focus:bg-white transition-all resize-none"
            {...register('specialRequests')}
          />
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
            {apiError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#C9A96E] text-white font-semibold rounded-xl hover:bg-[#A8854A] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Confirming...</> : 'Confirm Reservation'}
        </button>
      </form>
    </ModalWrapper>
  );
}

function ModalWrapper({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto z-10">
        {children}
      </div>
    </div>
  );
}
