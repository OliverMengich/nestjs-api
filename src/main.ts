import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// QR cide scan, feedback, certificate generation and emailing, agenda https://www.youtube.com/watch?v=jD9DLU2_kUE
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['verbose'],
    cors: true,
  });
  await app.listen(3000);
}
bootstrap();
