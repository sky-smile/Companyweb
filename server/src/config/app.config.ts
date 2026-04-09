export const appConfig = () => ({
  server: {
    nodeEnv: process.env.SERVER_NODE_ENV ?? 'development',
    port: Number(process.env.SERVER_PORT ?? 3000),
    globalPrefix: process.env.SERVER_GLOBAL_PREFIX ?? 'api',
  },
  database: {
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    name: process.env.DB_NAME ?? 'company_web',
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? '',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? '',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '2h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
  upload: {
    dir: process.env.UPLOAD_DIR ?? 'uploads',
    baseUrl: process.env.UPLOAD_BASE_URL ?? 'http://localhost:3000/uploads',
  },
});
