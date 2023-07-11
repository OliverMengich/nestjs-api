import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EventService } from './Events/events.service';
import { PrismaService } from './prisma.service';
import { LocationService } from './Location/location.service';
import { SpeakerService } from './Speaker/speaker.service';
import { AuthService } from './auth/auth.service';
// import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    // AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EventService,
    PrismaService,
    LocationService,
    SpeakerService,
    AuthService,
  ],
})
export class AppModule {}
