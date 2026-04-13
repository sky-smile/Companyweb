import { BrowserRouter } from 'react-router-dom';
import { App as AntApp, ConfigProvider, theme } from 'antd';
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
      <AntApp>
        <BrowserRouter>
          <AppBootstrap>
            <AppRouter />
          </AppBootstrap>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}
