import { useEffect, useState } from 'react';
import { Result, Spin } from 'antd';
import { authService } from '../../services/auth-service';
import { authStore } from '../../stores/auth-store';
import { useMessage } from '../../hooks/useMessage';

interface AppBootstrapProps {
  children: React.ReactNode;
}

export function AppBootstrap({ children }: AppBootstrapProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 初始化全局 message API
  useMessage();

  useEffect(() => {
    async function bootstrap() {
      if (!authStore.isAuthenticated()) {
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
  }, []);

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}><Spin size="large" /></div>;
  }

  if (error !== null) {
    return <Result status="warning" title="登录态已失效" subTitle={error} />;
  }

  return <>{children}</>;
}
