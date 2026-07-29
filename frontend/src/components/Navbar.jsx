import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Menu, X, User, CalendarDays, LogOut, ChevronDown } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const admin = (isAuthenticated && user.role === "admin");
  const owner = (isAuthenticated &&  user.role === "owner")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive
      ? 'text-[#C9A96E]'
      : scrolled
        ? 'text-gray-700 hover:text-[#C9A96E]'
        : 'text-white/90 hover:text-white'
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md border-b border-gray-100' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#C9A96E] rounded-full flex items-center justify-center flex-shrink-0">
              <UtensilsCrossed size={16} className="text-white" />
            </div>
            <span
              className={`font-serif text-xl font-semibold transition-colors ${scrolled ? 'text-gray-900' : 'text-white'
                }`}
            >
              DineSpot
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/restaurants" className={navLinkClass}>Restaurants</NavLink>
            <a
              href="#about"
              className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-[#C9A96E]' : 'text-white/90 hover:text-white'
                }`}
            >
              About
            </a>
            <a
              href="#contact"
              className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-[#C9A96E]' : 'text-white/90 hover:text-white'
                }`}
            >
              Contact
            </a>
            {(owner || admin) && (
              <NavLink
                to={admin ? "/admin" : "/owner"}
                className={navLinkClass}
              >
                {admin ? "Admin" : "Owner"} Dashboard
              </NavLink>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  id="profile-menu-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${scrolled
                    ? 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                    : 'text-white hover:bg-white/10 border border-white/30'
                    }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#C9A96E] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <span>{user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={profileOpen ? 'rotate-180' : ''} style={{ transition: 'transform 0.2s' }} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#C9A96E] transition-colors"
                    >
                      <User size={15} /> Profile
                    </Link>
                    <Link
                      to="/bookings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#C9A96E] transition-colors"
                    >
                      <CalendarDays size={15} /> My Bookings
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-sm font-medium px-4 py-2 rounded-full transition-all ${scrolled
                    ? 'text-gray-700 hover:text-[#C9A96E]'
                    : 'text-white hover:text-white/80'
                    }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold px-5 py-2.5 bg-[#C9A96E] text-white rounded-full hover:bg-[#A8854A] transition-all shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-btn"
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen
              ? <X size={22} className={scrolled ? 'text-gray-900' : 'text-white'} />
              : <Menu size={22} className={scrolled ? 'text-gray-900' : 'text-white'} />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            <NavLink
              to="/restaurants"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-[#C9A96E]"
            >
              Restaurants
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-[#C9A96E]">Profile</NavLink>
                <NavLink to="/bookings" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-[#C9A96E]">My Bookings</NavLink>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">Sign Out</button>
              </>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-[#C9A96E] hover:text-[#C9A96E]">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 bg-[#C9A96E] text-white rounded-full text-sm font-semibold hover:bg-[#A8854A]">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Close dropdown on outside click */}
      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
      )}
    </header>
  );
}
