import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { EventService } from './Events/events.service';
import { SpeakerService } from './Speaker/speaker.service';
import { LocationService } from './Location/location.service';
import { Location, Speaker, Event } from '@prisma/client';
import { AuthService } from './auth/auth.service';
@Controller()
export class AppController {
  constructor(
    private readonly eventService: EventService,
    private readonly appService: AppService,
    private readonly locationService: LocationService,
    private readonly speakerService: SpeakerService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('events')
  getEvents() {
    return this.eventService.events();
  }
  @Get('events/:id')
  getEvent(@Param('id') id: string) {
    return this.eventService.event(id);
  }
  @Post('events/:id')
  updateEvent(@Param('id') id: string, @Body() data: any) {
    console.log(id, data);
    return this.eventService.updateEvent({
      where: { id: id },
      data: data,
    });
  }
  @Post('new-event')
  createEvent(@Body() data: Event) {
    console.log(data);
    return this.eventService.createEvent(data);
  }
  @Delete('delete-event/:id')
  deleteEvent(@Param('id') id: string) {
    console.log(id);
    return this.eventService.deleteEvent({ id: id });
  }
  @Get('locations')
  getLocations() {
    // console.log('locations');
    return this.locationService.locations();
  }
  @Get('locations/:id')
  getLocation(@Param('id') id: string) {
    return this.locationService.location(id);
  }
  @Post('locations/:id')
  updateLocation(@Param('id') id: string, @Body() data: any) {
    return this.locationService.updateLocation({
      where: { id: id },
      data: data,
    });
  }
  @Post('new-location')
  createLocation(@Body() data: Location) {
    console.log(data);
    return this.locationService.createLocation(data);
  }
  @Delete('delete-location/:id')
  deleteLocation(@Param('id') id: string) {
    return this.locationService.deleteLocation({ id: id });
  }
  @Get('speakers')
  getSpeakers() {
    // console.log('locations');
    return this.speakerService.speakers();
  }
  @Get('speakers/:id')
  getSpeaker(@Param('id') id: string) {
    return this.speakerService.speaker(id);
  }
  @Post('new-speaker')
  createSpeaker(@Body() data: Speaker) {
    console.log(data);
    return this.speakerService.createSpeaker(data);
  }
  @HttpCode(HttpStatus.OK)
  @Post('auth/login')
  async login(@Body() user: any) {
    console.log(user);
    return this.authService.validateUser(user.email, user.password);
  }
}
