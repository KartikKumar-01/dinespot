import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  UtensilsCrossed, Edit3, Plus, AlertCircle, CheckCircle2,
  Loader2, MapPin, ChefHat, Tag, Clock, Users, Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription
} from '@/components/ui/sheet';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import useOwnerStore from '../../store/ownerStore';

const PRICE_RANGES = ['$', '$$', '$$$', '$$$$'];
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80';

export default function OwnerRestaurantPage() {
  const { restaurant, loading, error, fetchRestaurant, createRestaurant, updateRestaurant } = useOwnerStore();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const openCreate = () => { setIsEditing(false); setSheetOpen(true); };
  const openEdit = () => { setIsEditing(true); setSheetOpen(true); };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleFormSubmit = async (formData) => {
    const fd = new FormData();
    // Append all text fields
    ['name', 'description', 'cuisine', 'priceRange', 'location', 'address', 'chef', 'tags', 'availableSlots', 'totalSeats'].forEach((key) => {
      if (formData[key] !== undefined && formData[key] !== '') {
        fd.append(key, formData[key]);
      }
    });
    // Append image file if provided
    if (formData.image?.[0]) fd.append('image', formData.image[0]);

    const result = isEditing
      ? await updateRestaurant(fd)
      : await createRestaurant(fd);

    if (result.success) {
      setSheetOpen(false);
      showToast(isEditing ? 'Restaurant updated!' : 'Restaurant created! Awaiting admin approval.');
    } else {
      showToast(result.message, 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-gray-900">My Restaurant</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your restaurant profile and details</p>
        </div>
        {restaurant && (
          <Button onClick={openEdit} className="bg-[#C9A96E] hover:bg-[#A8854A] text-white gap-2">
            <Edit3 size={15} /> Edit Restaurant
          </Button>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium ${toast.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.msg}
        </div>
      )}

      {loading ? (
        <RestaurantSkeleton />
      ) : !restaurant ? (
        /* No restaurant yet */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <UtensilsCrossed size={40} className="text-[#C9A96E]" />
          </div>
          <h2 className="font-serif text-2xl text-gray-800 mb-2">No Restaurant Yet</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-sm">
            Register your restaurant to start accepting reservations. It will be reviewed by our admin team.
          </p>
          <Button onClick={openCreate} className="bg-[#C9A96E] hover:bg-[#A8854A] text-white gap-2 px-8">
            <Plus size={16} /> Register Restaurant
          </Button>
        </div>
      ) : (
        /* Restaurant detail view */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image + status */}
          <Card className="lg:col-span-1 border-gray-100 shadow-sm overflow-hidden">
            <div className="h-52 overflow-hidden">
              <img
                src={restaurant.image || FALLBACK_IMG}
                alt={restaurant.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = FALLBACK_IMG; }}
              />
            </div>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-serif text-xl text-gray-900 font-medium">{restaurant.name}</h2>
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
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{restaurant.description}</p>
            </CardContent>
          </Card>

          {/* Details */}
          <Card className="lg:col-span-2 border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif text-xl text-gray-900">Restaurant Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <DetailRow icon={UtensilsCrossed} label="Cuisine" value={restaurant.cuisine} />
                <DetailRow icon={Tag} label="Price Range" value={restaurant.priceRange} />
                <DetailRow icon={MapPin} label="Location" value={restaurant.location} />
                <DetailRow icon={ChefHat} label="Head Chef" value={restaurant.chef} />
                <DetailRow icon={Users} label="Total Seats" value={String(restaurant.totalSeats || 20)} />
                <DetailRow icon={MapPin} label="Address" value={restaurant.address} />
              </div>
              <Separator />
              {/* Slots */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3 flex items-center gap-1.5">
                  <Clock size={12} /> Available Time Slots
                </p>
                <div className="flex flex-wrap gap-2">
                  {(restaurant.availableSlots || []).map((slot) => (
                    <span key={slot} className="text-xs px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full border border-amber-100 font-medium">{slot}</span>
                  ))}
                </div>
              </div>
              {/* Tags */}
              {restaurant.tags?.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3 flex items-center gap-1.5">
                    <Tag size={12} /> Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1.5 bg-gray-50 text-gray-600 rounded-full border border-gray-100">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create / Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto p-5">
          <SheetHeader className="mb-6">
            <SheetTitle className="font-serif text-2xl">
              {isEditing ? 'Edit Restaurant' : 'Register Restaurant'}
            </SheetTitle>
            <SheetDescription className="text-sm text-gray-500">
              {isEditing
                ? 'Update your restaurant profile information.'
                : 'Fill in your restaurant details. It will be reviewed before going live.'}
            </SheetDescription>
          </SheetHeader>
          <RestaurantForm
            defaultValues={isEditing ? restaurant : {}}
            onSubmit={handleFormSubmit}
            isEditing={isEditing}
            loading={loading}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

function RestaurantForm({ defaultValues = {}, onSubmit, isEditing, loading }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: defaultValues.name || '',
      description: defaultValues.description || '',
      cuisine: defaultValues.cuisine || '',
      priceRange: defaultValues.priceRange || '',
      location: defaultValues.location || '',
      address: defaultValues.address || '',
      chef: defaultValues.chef || '',
      tags: (defaultValues.tags || []).join(', '),
      availableSlots: (defaultValues.availableSlots || []).join(', '),
      totalSeats: defaultValues.totalSeats || 20,
    },
  });

  const priceRange = watch('priceRange');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormField label="Restaurant Name" error={errors.name}>
        <Input placeholder="e.g. The Golden Fork" {...register('name', { required: !isEditing && 'Name is required' })} />
      </FormField>

      <FormField label="Description" error={errors.description}>
        <Textarea rows={3} placeholder="Describe your restaurant..." {...register('description', { required: !isEditing && 'Description is required' })} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Cuisine" error={errors.cuisine}>
          <Input placeholder="e.g. Italian" {...register('cuisine', { required: !isEditing && 'Required' })} />
        </FormField>
        <FormField label="Price Range">
          <Select value={priceRange} onValueChange={(v) => setValue('priceRange', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select price" />
            </SelectTrigger>
            <SelectContent>
              {PRICE_RANGES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Location (City)" error={errors.location}>
          <Input placeholder="e.g. Mumbai" {...register('location', { required: !isEditing && 'Required' })} />
        </FormField>
        <FormField label="Head Chef" error={errors.chef}>
          <Input placeholder="Chef name" {...register('chef', { required: !isEditing && 'Required' })} />
        </FormField>
      </div>

      <FormField label="Full Address" error={errors.address}>
        <Input placeholder="e.g. 12, Marine Drive, Mumbai" {...register('address', { required: !isEditing && 'Required' })} />
      </FormField>

      <FormField label="Tags (comma-separated)">
        <Input placeholder="e.g. romantic, rooftop, vegan-friendly" {...register('tags')} />
      </FormField>

      <FormField label="Available Time Slots (comma-separated, HH:MM)">
        <Input placeholder="e.g. 18:00, 19:00, 20:00, 21:00" {...register('availableSlots')} />
      </FormField>

      <FormField label="Total Seats">
        <Input type="number" min={1} max={500} {...register('totalSeats')} />
      </FormField>

      <FormField label="Restaurant Image">
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 cursor-pointer hover:border-[#C9A96E] transition-colors">
          <ImageIcon size={15} className="text-gray-400" />
          <input type="file" accept="image/*" className="text-sm text-gray-600 w-full bg-transparent outline-none" {...register('image')} />
        </div>
      </FormField>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#C9A96E] hover:bg-[#A8854A] text-white font-semibold py-3 gap-2"
      >
        {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : isEditing ? 'Update Restaurant' : 'Register Restaurant'}
      </Button>
    </form>
  );
}

function FormField({ label, children, error }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={14} className="text-[#C9A96E]" />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm text-gray-800 font-medium">{value || '—'}</p>
      </div>
    </div>
  );
}

function RestaurantSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Skeleton className="h-80 rounded-2xl" />
      <div className="lg:col-span-2 space-y-4">
        <Skeleton className="h-8 w-1/2 rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      </div>
    </div>
  );
}
