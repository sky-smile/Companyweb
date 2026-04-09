import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
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
        <AppRouter />
      </BrowserRouter>
    </ConfigProvider>
  );
}
