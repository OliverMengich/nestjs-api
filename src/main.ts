import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
// QR cide scan, feedback, certificate generation and emailing, agenda https://www.youtube.com/watch?v=jD9DLU2_kUE
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['verbose'],
    cors: true,
  });
  console.log('dirname', __dirname);
  app.use(
    '/events',
    express.static(join(__dirname, '..', 'src', 'Events', 'posters')),
  );
  app.use('/users', express.static(join(__dirname, '..', 'src', 'uploads')));
  await app.listen(3000);
}
bootstrap();
