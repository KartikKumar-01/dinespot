import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleRoute from '../components/RoleRoute';
import HomePage from '../pages/HomePage';
import RestaurantsPage from '../pages/RestaurantsPage';
import RestaurantDetailPage from '../pages/RestaurantDetailPage';
import BookingsPage from '../pages/BookingsPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
// Owner pages
import OwnerDashboardPage from '../pages/owner/OwnerDashboardPage';
import OwnerRestaurantPage from '../pages/owner/OwnerRestaurantPage';
import OwnerBookingsPage from '../pages/owner/OwnerBookingsPage';
// Admin pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminRestaurantsPage from '../pages/admin/AdminRestaurantsPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';

export default function AppRouter() {
  return (
    <Routes>
      {/* Auth pages (no layout) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Main layout — customer-facing */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="/restaurants/:slug" element={<RestaurantDetailPage />} />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Owner dashboard */}
      <Route
        element={
          <RoleRoute role="owner">
            <DashboardLayout role="owner" />
          </RoleRoute>
        }
      >
        <Route path="/owner" element={<OwnerDashboardPage />} />
        <Route path="/owner/restaurant" element={<OwnerRestaurantPage />} />
        <Route path="/owner/bookings" element={<OwnerBookingsPage />} />
      </Route>

      {/* Admin dashboard */}
      <Route
        element={
          <RoleRoute role="admin">
            <DashboardLayout role="admin" />
          </RoleRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/restaurants" element={<AdminRestaurantsPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
      </Route>
    </Routes>
  );
}
