import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Users, UserCheck, UserPlus, Eye, EyeOff,
  Loader2, CheckCircle2, AlertCircle, ShieldCheck, UtensilsCrossed
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription
} from '@/components/ui/sheet';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import useAdminStore from '../../store/adminStore';
import { registerUser } from '../../api/authApi';

const ROLE_OPTIONS = [
  {
    value: 'user',
    label: 'Customer',
    desc: 'Can browse restaurants and make bookings',
    icon: Users,
    color: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    value: 'owner',
    label: 'Restaurant Owner',
    desc: 'Can register and manage a restaurant',
    icon: UtensilsCrossed,
    color: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  {
    value: 'admin',
    label: 'Administrator',
    desc: 'Full platform access and management',
    icon: ShieldCheck,
    color: 'bg-purple-50 text-purple-600 border-purple-200',
  },
];

export default function AdminUsersPage() {
  const { stats } = useAdminStore();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [defaultRole, setDefaultRole] = useState('user');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const openSheet = (role = 'user') => {
    setDefaultRole(role);
    setSheetOpen(true);
  };

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.users?.total ?? '—',
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      action: () => openSheet('user'),
      actionLabel: 'Create Customer',
    },
    {
      label: 'Restaurant Owners',
      value: stats?.users?.totalOwner ?? '—',
      icon: UtensilsCrossed,
      color: 'bg-amber-50 text-amber-600',
      action: () => openSheet('owner'),
      actionLabel: 'Create Owner',
    },
    {
      label: 'Customers',
      value: stats?.users?.totalUser ?? '—',
      icon: UserCheck,
      color: 'bg-emerald-50 text-emerald-600',
      action: () => openSheet('user'),
      actionLabel: 'Create Customer',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl text-gray-900">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage platform users and restaurant owners</p>
        </div>
        <Button
          onClick={() => openSheet('user')}
          className="bg-[#C9A96E] hover:bg-[#A8854A] text-white gap-2"
        >
          <UserPlus size={16} /> Create User
        </Button>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium ${
          toast.type === 'error'
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, action, actionLabel }) => (
          <Card key={label} className="border-gray-100 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon size={18} />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
              <p className="text-xs text-gray-500 font-medium mb-4">{label}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={action}
                className="w-full text-xs border-gray-200 hover:border-[#C9A96E] hover:text-[#C9A96E] gap-1.5"
              >
                <UserPlus size={12} /> {actionLabel}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role type reference */}
      <div>
        <h2 className="font-serif text-xl text-gray-900 mb-5">Account Roles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ROLE_OPTIONS.map(({ value, label, desc, icon: Icon, color }) => (
            <div
              key={value}
              onClick={() => openSheet(value)}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#C9A96E]/40 transition-all cursor-pointer group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${color}`}>
                <Icon size={17} />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <p className="font-semibold text-gray-900 text-sm">{label}</p>
                <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${color}`}>
                  {value}
                </Badge>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
              <Separator className="my-4" />
              <Button
                size="sm"
                className="w-full text-xs bg-[#C9A96E] hover:bg-[#A8854A] text-white gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <UserPlus size={12} /> Create {label}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Create user sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto px-3 py-2">
          <SheetHeader className="mb-6">
            <SheetTitle className="font-serif text-2xl">Create New Account</SheetTitle>
            <SheetDescription className="text-sm text-gray-500">
              Fill in the details below to create a new platform account. The user will be able to log in immediately.
            </SheetDescription>
          </SheetHeader>
          <CreateUserForm
            defaultRole={defaultRole}
            onSuccess={(name, role) => {
              setSheetOpen(false);
              showToast(`Account created for "${name}" with role: ${role}`);
            }}
            onError={(msg) => showToast(msg, 'error')}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

function CreateUserForm({ defaultRole, onSuccess, onError }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { role: defaultRole, name: '', email: '', password: '', phone: '' },
  });

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const selectedRole = watch('role');

  const roleInfo = ROLE_OPTIONS.find((r) => r.value === selectedRole);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password, phone: data.phone || undefined, role: data.role });
      reset();
      onSuccess(data.name, data.role);
    } catch (err) {
      onError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Role selector */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          Account Role
        </label>
        <Select value={selectedRole} onValueChange={(v) => setValue('role', v)}>
          <SelectTrigger className="border-gray-200 focus:border-[#C9A96E]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map(({ value, label, icon: Icon }) => (
              <SelectItem key={value} value={value} className={'p-2'}>
                <div className="flex items-center gap-2">
                  <Icon size={14} /> {label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {roleInfo && (
          <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1.5">
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${
              selectedRole === 'admin' ? 'bg-purple-400' : selectedRole === 'owner' ? 'bg-amber-400' : 'bg-blue-400'
            }`} />
            {roleInfo.desc}
          </p>
        )}
      </div>

      <Separator />

      {/* Name */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Full Name</label>
        <Input
          placeholder="e.g. Arjun Mehta"
          className={`border-gray-200 focus:border-[#C9A96E] ${errors.name ? 'border-red-300' : ''}`}
          {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Email Address</label>
        <Input
          type="email"
          placeholder="user@example.com"
          className={`border-gray-200 focus:border-[#C9A96E] ${errors.email ? 'border-red-300' : ''}`}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
          })}
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          Phone <span className="normal-case font-normal text-gray-400">(optional)</span>
        </label>
        <Input
          type="tel"
          placeholder="+91 98765 43210"
          className="border-gray-200 focus:border-[#C9A96E]"
          {...register('phone')}
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Password</label>
        <div className="relative">
          <Input
            type={showPass ? 'text' : 'password'}
            placeholder="Min. 6 characters"
            className={`pr-10 border-gray-200 focus:border-[#C9A96E] ${errors.password ? 'border-red-300' : ''}`}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Min 6 characters' },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#C9A96E] hover:bg-[#A8854A] text-white font-semibold py-3 gap-2 mt-2"
      >
        {loading
          ? <><Loader2 size={15} className="animate-spin" /> Creating account...</>
          : <><UserPlus size={15} /> Create Account</>
        }
      </Button>
    </form>
  );
}
