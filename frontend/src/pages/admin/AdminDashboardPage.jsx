import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, UtensilsCrossed, CalendarDays, UserCheck,
  ChevronRight, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import useAdminStore from '../../store/adminStore';
import { formatDate, formatTime, getStatusColor } from '../../utils/formatters';

export default function AdminDashboardPage() {
  const { stats, loading, fetchStats } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.users?.total ?? '—',
      sub: `${stats?.users?.totalUser ?? 0} customers · ${stats?.users?.totalOwner ?? 0} owners`,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Restaurants',
      value: stats?.restaurants?.total ?? '—',
      sub: 'Listed on platform',
      icon: UtensilsCrossed,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Total Bookings',
      value: stats?.bookings?.total ?? '—',
      sub: 'All-time reservations',
      icon: CalendarDays,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Restaurant Owners',
      value: stats?.users?.totalOwner ?? '—',
      sub: 'Active restaurant owners',
      icon: UserCheck,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-gray-900">Admin Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Platform-wide statistics and recent activity</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, sub, icon: Icon, color }) => (
          <Card key={label} className="border-gray-100 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon size={18} />
              </div>
              {loading ? (
                <Skeleton className="h-8 w-16 mb-1" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{value}</p>
              )}
              <p className="text-xs font-semibold text-gray-700 mt-1">{label}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Latest bookings */}
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="font-serif text-xl text-gray-900 flex items-center gap-2">
            <TrendingUp size={20} className="text-[#C9A96E]" /> Latest Bookings
          </CardTitle>
          <Button asChild variant="ghost" size="sm" className="text-[#C9A96E] hover:text-[#A8854A] text-xs">
            <Link to="/admin/restaurants">Manage Restaurants <ChevronRight size={12} className="ml-1" /></Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
            </div>
          ) : !stats?.latestBookings?.length ? (
            <div className="text-center py-12 text-gray-400">
              <CalendarDays size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No bookings recorded yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-50 hover:bg-transparent">
                    <TableHead className="text-xs font-bold uppercase tracking-wide text-gray-400 pl-6">Guest</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide text-gray-400">Restaurant</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide text-gray-400">Date</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide text-gray-400">Guests</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide text-gray-400 pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.latestBookings.map((b) => (
                    <TableRow key={b._id} className="border-gray-50 hover:bg-amber-50/30 transition-colors">
                      <TableCell className="pl-6">
                        <p className="text-sm font-semibold text-gray-800">{b.user?.name}</p>
                        <p className="text-xs text-gray-400">{b.user?.email}</p>
                      </TableCell>
                      <TableCell className="text-sm text-gray-700 font-medium">{b.restaurant?.name}</TableCell>
                      <TableCell className="text-xs text-gray-500">{formatDate(b.date)} · {formatTime(b.time)}</TableCell>
                      <TableCell className="text-sm text-gray-700">{b.guests}</TableCell>
                      <TableCell className="pr-6">
                        <Badge className={`text-xs border ${getStatusColor(b.status)}`}>{b.status}</Badge>
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
