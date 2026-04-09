import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { AppBootstrap } from './components/common/AppBootstrap';
import { AppRouter } from './router';

export function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1f5eff',
          borderRadius: 12,
          fontFamily: 'Segoe UI, PingFang SC, Microsoft YaHei, sans-serif',
        },
      }}
    >
      <BrowserRouter>
        <AppBootstrap>
          <AppRouter />
        </AppBootstrap>
      </BrowserRouter>
    </ConfigProvider>
  );
}
