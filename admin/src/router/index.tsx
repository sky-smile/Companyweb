import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { authStore } from '../stores/auth-store';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { RolesPage } from '../pages/RolesPage';

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
        <Route path="content/news" element={<PlaceholderPage title="新闻管理" description="新闻列表、发布和编辑器将在当前后台骨架上继续接入。" />} />
        <Route path="content/announcements" element={<PlaceholderPage title="公告管理" description="公告管理页面将在下一阶段补充完整 CRUD 界面。" />} />
        <Route path="content/products" element={<PlaceholderPage title="产品管理" description="产品列表、分类和详情编辑界面将在下一阶段补充。" />} />
        <Route path="site/pages" element={<PlaceholderPage title="页面内容" description="关于我们、联系我们与首页静态内容维护将在这里接入。" />} />
        <Route path="site/banners" element={<PlaceholderPage title="Banner 管理" description="Banner 列表与上传选择器将在下一阶段补充。" />} />
        <Route path="site/settings" element={<PlaceholderPage title="站点设置" description="站点基础信息和联系方式配置将在这里维护。" />} />
        <Route path="media/upload" element={<PlaceholderPage title="媒体中心" description="图片上传、文件选择和引用回填将在这里接入。" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
