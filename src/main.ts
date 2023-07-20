import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
// QR cide scan, feedback, certificate generation and emailing, agenda https://www.youtube.com/watch?v=jD9DLU2_kUE
// =======Event App Todo====
// - Document generation PASS
// - Image upload
// - Event registration form
// - Maps integration
// - State management integration
// - Notifications integration
// - Checkout page integration
// - Login as admin or User or Speaker
// 	- Checkout for user if not speaker or user
// - State management and data accessing from the cache
// - Event registration form
// - Events history
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
  app.use(
    '/users',
    express.static(join(__dirname, '..', 'src', 'Users', 'uploads')),
  );
  app.use(
    '/locations',
    express.static(join(__dirname, '..', 'src', 'Location', 'images')),
  );

  await app.listen(3000);
}
bootstrap();
