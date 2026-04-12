import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const globalPrefix = configService.get<string>('server.globalPrefix', 'api');
  const port = configService.get<number>('server.port', 3000);
  const uploadDir = configService.get<string>('upload.dir', 'uploads');

  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin: true, // 允许所有来源（开发环境）
    credentials: true, // 允许携带 cookie
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, Accept',
  });
  app.use('/uploads', express.static(uploadDir));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port);
}

void bootstrap();
