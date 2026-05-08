import { useEffect, useState } from 'react';
import { Result, Spin } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth-service';
import { authStore } from '../../stores/auth-store';
import { useMessage } from '../../hooks/useMessage';

interface AppBootstrapProps {
  children: React.ReactNode;
}

export function AppBootstrap({ children }: AppBootstrapProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  // 初始化全局 message API
  useMessage();

  useEffect(() => {
    async function bootstrap() {
      // 如果在登录页，不请求 profile
      if (location.pathname === '/admin/login') {
        setLoading(false);
        return;
      }

      // 如果已经加载过 profile，不再重复请求
      if (authStore.getProfile() !== null) {
        setLoading(false);
        return;
      }

      try {
        const profile = await authService.getProfile();
        authStore.setProfile(profile);
        setError(null);
      } catch (bootstrapError) {
        authStore.clearSession();
        setError(bootstrapError instanceof Error ? bootstrapError.message : 'Profile bootstrap failed');
      } finally {
        setLoading(false);
      }
    }

    void bootstrap();
  }, []); // 只在组件挂载时执行一次

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}><Spin size="large" /></div>;
  }

  if (error !== null) {
    return <Result status="warning" title="登录态已失效" subTitle={error} />;
  }

  return <>{children}</>;
}
