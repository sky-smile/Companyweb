import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { authStore } from '../stores/auth-store';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { AnnouncementsPage } from '../pages/AnnouncementsPage';
import { BannersPage } from '../pages/BannersPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { MediaCenterPage } from '../pages/MediaCenterPage';
import { NewsPage } from '../pages/NewsPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { ProductsPage } from '../pages/ProductsPage';
import { RolesPage } from '../pages/RolesPage';
import { SiteContentPage } from '../pages/SiteContentPage';

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const location = useLocation();

  if (!authStore.isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="account/admin-users" element={<AdminUsersPage />} />
        <Route path="account/roles" element={<RolesPage />} />
        <Route path="content/news" element={<NewsPage />} />
        <Route path="content/announcements" element={<AnnouncementsPage />} />
        <Route path="content/products" element={<ProductsPage />} />
        <Route path="site/pages" element={<SiteContentPage />} />
        <Route path="site/banners" element={<BannersPage />} />
        <Route path="site/settings" element={<SiteContentPage />} />
        <Route path="media/upload" element={<MediaCenterPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
