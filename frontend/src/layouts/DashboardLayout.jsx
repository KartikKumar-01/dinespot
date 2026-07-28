import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, UtensilsCrossed, CalendarDays, Users,
  LogOut, Menu, X, ChevronRight, ShieldCheck
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import useAuthStore from '../store/authStore';

const OWNER_NAV = [
  { to: '/owner', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/owner/restaurant', label: 'My Restaurant', icon: UtensilsCrossed },
  { to: '/owner/bookings', label: 'Bookings', icon: CalendarDays },
];

const ADMIN_NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/restaurants', label: 'Restaurants', icon: UtensilsCrossed },
  { to: '/admin/users', label: 'Users', icon: Users },
];

export default function DashboardLayout({ role = 'owner' }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = role === 'admin' ? ADMIN_NAV : OWNER_NAV;
  const dashTitle = role === 'admin' ? 'Admin Panel' : 'Owner Dashboard';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-6 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#C9A96E] rounded-full flex items-center justify-center flex-shrink-0">
            <UtensilsCrossed size={15} className="text-white" />
          </div>
          <div>
            <p className="font-serif text-base font-semibold text-gray-900 leading-tight">DineSpot</p>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{dashTitle}</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-amber-50 text-[#C9A96E] font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon size={17} />
            {label}
            <ChevronRight size={14} className="ml-auto opacity-40" />
          </NavLink>
        ))}
      </nav>

      <Separator />

      {/* User */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="w-9 h-9 border-2 border-[#C9A96E]/30">
            <AvatarFallback className="bg-amber-50 text-[#C9A96E] font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize truncate">{user?.role}</p>
          </div>
          {role === 'admin' && <ShieldCheck size={15} className="text-[#C9A96E] flex-shrink-0" />}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 text-xs"
        >
          <LogOut size={14} /> Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 shadow-sm fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 shadow-sm h-14 flex items-center px-4 gap-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#C9A96E] rounded-full flex items-center justify-center">
            <UtensilsCrossed size={13} className="text-white" />
          </div>
          <span className="font-serif font-semibold text-gray-900">{dashTitle}</span>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
