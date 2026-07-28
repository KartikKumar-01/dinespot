export const formatPrice = (priceRange) => {
  const map = { '$': 'Budget', '$$': 'Moderate', '$$$': 'Fine Dining', '$$$$': 'Ultra Fine' };
  return map[priceRange] || priceRange;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatTime = (time) => {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
};

export const getStatusColor = (status) => {
  const map = {
    confirmed: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    cancelled: 'text-red-600 bg-red-50 border-red-200',
    completed: 'text-blue-600 bg-blue-50 border-blue-200',
  };
  return map[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};
