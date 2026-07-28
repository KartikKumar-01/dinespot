import { useEffect, useState } from 'react';
import {
  CalendarDays, Users, Clock, AlertCircle, ChevronDown, Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useOwnerStore from '../../store/ownerStore';
import { formatDate, formatTime, getStatusColor } from '../../utils/formatters';

const STATUS_OPTIONS = ['confirmed', 'completed', 'cancelled'];
const FILTERS = ['all', 'confirmed', 'completed', 'cancelled'];

export default function OwnerBookingsPage() {
  const { bookings, loading, error, fetchBookings, updateBookingStatus } = useOwnerStore();
  const [filter, setFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    setActionError('');
    const result = await updateBookingStatus(id, status);
    if (!result.success) setActionError(result.message);
    setUpdatingId(null);
  };

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === 'all' ? bookings.length : bookings.filter((b) => b.status === f).length;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-gray-900">Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage all reservations for your restaurant</p>
      </div>

      {actionError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-sm text-red-600">
          <AlertCircle size={16} /> {actionError}
        </div>
      )}

      {/* Filter tabs */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="bg-gray-100">
          {FILTERS.map((f) => (
            <TabsTrigger key={f} value={f} className="capitalize text-xs gap-1.5 data-[state=active]:bg-white data-[state=active]:text-[#C9A96E] data-[state=active]:shadow-sm">
              {f} <span className="bg-gray-200 text-gray-600 rounded-full px-1.5 py-0.5 text-[10px] font-bold">{counts[f]}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card className="border-gray-100 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <CalendarDays size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="text-gray-400 text-sm">No {filter === 'all' ? '' : filter} bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-50 hover:bg-transparent">
                    <TableHead className="text-xs font-bold uppercase tracking-wide text-gray-400 pl-6">Guest</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide text-gray-400">Date & Time</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide text-gray-400">Guests</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide text-gray-400">Occasion</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide text-gray-400">Status</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide text-gray-400 pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((booking) => (
                    <TableRow key={booking._id} className="border-gray-50 hover:bg-amber-50/30 transition-colors">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                            <span className="text-[#C9A96E] text-xs font-bold">
                              {booking.user?.name?.[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{booking.user?.name}</p>
                            <p className="text-xs text-gray-400">{booking.user?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <CalendarDays size={13} className="text-[#C9A96E]" />
                          {formatDate(booking.date)}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                          <Clock size={11} className="text-gray-300" />
                          {formatTime(booking.time)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <Users size={13} className="text-[#C9A96E]" />
                          {booking.guests}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-gray-500">{booking.occasion || '—'}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6">
                        {updatingId === booking._id ? (
                          <Loader2 size={16} className="animate-spin text-[#C9A96E]" />
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 text-xs gap-1 border-gray-200">
                                Update <ChevronDown size={12} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              {STATUS_OPTIONS.filter((s) => s !== booking.status).map((s) => (
                                <DropdownMenuItem
                                  key={s}
                                  className="capitalize text-sm cursor-pointer"
                                  onClick={() => handleStatusUpdate(booking._id, s)}
                                >
                                  Mark {s}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
