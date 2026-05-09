import { useCallback, useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth-service';
import { authStore } from '../../stores/auth-store';
import { useMessage } from '../../hooks/useMessage';

interface AppBootstrapProps {
  children: React.ReactNode;
}

export function AppBootstrap({ children }: AppBootstrapProps) {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  useMessage();

  const toLogin = useCallback(() => {
    navigate('/login', { replace: true, state: { sessionExpired: true } });
  }, [navigate]);

  useEffect(() => {
    window.addEventListener('auth:session-expired', toLogin);
    return () => window.removeEventListener('auth:session-expired', toLogin);
  }, [toLogin]);

  useEffect(() => {
    async function bootstrap() {
      if (location.pathname === '/login') {
        setLoading(false);
        return;
      }

      if (authStore.getProfile() !== null) {
        setLoading(false);
        return;
      }

      try {
        const profile = await authService.getProfile();
        authStore.setProfile(profile);
      } catch {
        authStore.clearSession();
        // 当前不在登录页则跳转登录，避免组件树未更新时被 ProtectedRoute 抢先渲染错误态
        if (location.pathname !== '/login') {
          toLogin();
          return;
        }
      } finally {
        setLoading(false);
      }
    }

    void bootstrap();
  }, []);

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}><Spin size="large" /></div>;
  }

  return <>{children}</>;
}
