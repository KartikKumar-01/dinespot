import { useEffect, useState } from 'react';
import {
  CheckCircle2, XCircle, Clock, UtensilsCrossed, MapPin,
  AlertCircle, Loader2, User, Search
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import useAdminStore from '../../store/adminStore';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=70';
const STATUS_FILTERS = ['all', 'pending', 'approved', 'rejected'];

export default function AdminRestaurantsPage() {
  const { restaurants, loading, error, fetchAllRestaurants, approveRestaurant } = useAdminStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [actionTarget, setActionTarget] = useState(null); // { id, name, newStatus }
  const [actioning, setActioning] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchAllRestaurants();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleConfirmAction = async () => {
    if (!actionTarget) return;
    setActioning(true);
    const result = await approveRestaurant(actionTarget.id, actionTarget.newStatus);
    setActioning(false);
    setActionTarget(null);
    if (result.success) {
      showToast(`"${actionTarget.name}" marked as ${actionTarget.newStatus}`);
    } else {
      showToast(result.message, 'error');
    }
  };

  const filtered = restaurants
    .filter((r) => filter === 'all' || r.status === filter)
    .filter((r) =>
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.location?.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine?.toLowerCase().includes(search.toLowerCase())
    );

  const counts = STATUS_FILTERS.reduce((acc, f) => {
    acc[f] = f === 'all' ? restaurants.length : restaurants.filter((r) => r.status === f).length;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-gray-900">Restaurant Management</h1>
        <p className="text-gray-500 text-sm mt-1">Review, approve, or reject restaurant submissions</p>
      </div>

      {toast && (
        <div className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium ${toast.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <Tabs value={filter} onValueChange={setFilter} className="flex-shrink-0">
          <TabsList className="bg-gray-100">
            {STATUS_FILTERS.map((f) => (
              <TabsTrigger
                key={f}
                value={f}
                className="capitalize text-xs gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                style={{ color: filter === f ? statusColor(f) : undefined }}
              >
                {f}
                <span className="bg-gray-200 text-gray-600 rounded-full px-1.5 py-0.5 text-[10px] font-bold">
                  {counts[f]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative flex-1 min-w-0 w-full sm:w-auto">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search name, location, cuisine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white border-gray-200 text-sm"
          />
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <AlertCircle size={40} className="mx-auto mb-3 text-red-400" />
          <p className="text-gray-500">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <UtensilsCrossed size={40} className="mx-auto mb-3 text-gray-200" />
          <p className="text-gray-400 text-sm">No restaurants match your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((r) => (
            <RestaurantAdminCard
              key={r._id}
              restaurant={r}
              onAction={(newStatus) =>
                setActionTarget({ id: r._id, name: r.name, newStatus })
              }
            />
          ))}
        </div>
      )}

      {/* Confirm dialog */}
      <AlertDialog open={!!actionTarget} onOpenChange={(open) => !open && setActionTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark <strong>"{actionTarget?.name}"</strong> as{' '}
              <strong>{actionTarget?.newStatus}</strong>? This affects its public visibility.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actioning}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={actioning}
              className={
                actionTarget?.newStatus === 'approved'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : actionTarget?.newStatus === 'rejected'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-amber-500 hover:bg-amber-600'
              }
            >
              {actioning ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function RestaurantAdminCard({ restaurant, onAction }) {
  const { _id, name, cuisine, priceRange, location, image, owner, status } = restaurant;

  const statusBadgeClass =
    status === 'approved'
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
      : status === 'pending'
      ? 'bg-amber-100 text-amber-700 border-amber-200'
      : 'bg-red-100 text-red-700 border-red-200';

  return (
    <Card className="border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="flex">
        <div className="w-28 h-auto flex-shrink-0 overflow-hidden">
          <img
            src={image || FALLBACK_IMG}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = FALLBACK_IMG; }}
          />
        </div>
        <CardContent className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-base leading-snug truncate">{name}</h3>
            <Badge className={`text-xs border flex-shrink-0 ${statusBadgeClass}`}>{status}</Badge>
          </div>
          <div className="space-y-1 mb-3">
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <UtensilsCrossed size={11} className="text-[#C9A96E]" />
              {cuisine} · {priceRange}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <MapPin size={11} className="text-[#C9A96E]" />
              {location}
            </p>
            {owner && (
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <User size={11} className="text-[#C9A96E]" />
                {owner.name} · {owner.email}
              </p>
            )}
          </div>
          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap">
            {status !== 'approved' && (
              <Button
                size="sm"
                className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                onClick={() => onAction('approved')}
              >
                <CheckCircle2 size={11} /> Approve
              </Button>
            )}
            {status !== 'rejected' && (
              <Button
                size="sm"
                variant="destructive"
                className="h-7 text-xs gap-1"
                onClick={() => onAction('rejected')}
              >
                <XCircle size={11} /> Reject
              </Button>
            )}
            {status !== 'pending' && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-amber-200 text-amber-600 hover:bg-amber-50 gap-1"
                onClick={() => onAction('pending')}
              >
                <Clock size={11} /> Set Pending
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

function statusColor(status) {
  const map = { pending: '#d97706', approved: '#059669', rejected: '#dc2626' };
  return map[status] || undefined;
}
