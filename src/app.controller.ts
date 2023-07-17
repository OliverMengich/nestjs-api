import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { Express } from 'express';
import { mkdir, mkdirSync, writeFileSync } from 'fs';
import { AppService } from './app.service';
import { EventService } from './Events/events.service';
import { SpeakerService } from './Speaker/speaker.service';
import { LocationService } from './Location/location.service';
import { Speaker, Attendee } from '@prisma/client';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { UserService } from './Users/user.service';
import {
  FileInterceptor,
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
interface NewRequest extends Request {
  user: Attendee;
}
@Controller()
export class AppController {
  constructor(
    private readonly eventService: EventService,
    private readonly appService: AppService,
    private readonly locationService: LocationService,
    private readonly speakerService: SpeakerService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
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
  @UseGuards(AuthGuard)
  @Post('new-event')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'posters', maxCount: 3 }]))
  createEvent(
    @Body() data,
    @Request() req: NewRequest,
    @UploadedFiles()
    files: {
      posters: Express.Multer.File[];
    },
  ) {
    console.log(data, files);
    console.log(req.user);
    const imageArr: string[] = [];
    if (files) {
      const randomnumber = Math.floor(Math.random() * 1000000 + 1);
      files.posters.forEach((poster) => {
        console.log(poster);
        imageArr.push(
          'http://localhost:3000/events/posters/' + randomnumber + '.png',
        );
        mkdirSync(`./src/Events/posters/`, { recursive: true });
        writeFileSync(
          `./src/Events/posters/${randomnumber}.png`,
          poster.buffer,
        );
      });
    }
    console.log(imageArr, 'Images array');
    // return {
    //   message: 'Event created successfully',
    // };
    return this.eventService.createEvent({
      ...JSON.parse(data.request),
      image: imageArr,
    });
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
  @UseGuards(AuthGuard)
  @Post('new-location')
  @UseInterceptors(FilesInterceptor('files'))
  createLocation(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() data: any,
    // @Request() req: NewRequest,
  ) {
    const imageArr: string[] = [];
    files.forEach((img) => {
      const randomnumber = Math.floor(Math.random() * 1000000 + 1);
      console.log(img);
      imageArr.push(
        'http://localhost:3000/location/posters' + randomnumber + '.png',
      );
      mkdirSync(`./src/Location/images/`, { recursive: true });
      writeFileSync(`./src/Location/images/${randomnumber}.png`, img.buffer);
    });
    console.log(imageArr, 'Images array');
    return this.locationService.createLocation({
      ...JSON.parse(data.request),
      images: imageArr,
    });
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
  @Get('attendees')
  getAttendees() {
    // console.log('locations');
    return this.userService.getAttendees();
  }
  @Post('register')
  async register(@Body() user: Attendee) {
    console.log(user);
    return this.authService.registerUser(user);
  }
  @HttpCode(HttpStatus.OK)
  @Post('auth/login')
  async login(@Body() user: Omit<Attendee, 'id'>) {
    console.log(user.email);
    if (!user.email && !user.name && !user.password) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Some error description',
      });
    }
    return this.authService.validateUser(user.email, user.password);
  }
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req: NewRequest): Promise<Attendee> {
    const user = req.user;
    if (!user.email && !user.name && !user.id) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Error Encountered!!',
      });
    }
    return this.userService.getUserInfo(req.user.id);
  }
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('attendee/upload')
  upLoadFile(
    @Request() req: NewRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file, req.user.id, __dirname);
    mkdir('./src/Users/uploads' + req.user.id, { recursive: true }, (err) => {
      if (err) throw err;
    });
    writeFileSync(
      `./src/uploads/${req.user.id}/${file.originalname}`,
      Buffer.from(new Uint8Array(file.buffer)),
    );
    const userImagePath =
      'https://localhost:3000/src/Users/uploads/' +
      req.user.id +
      file.originalname;
    return this.userService.normalUpdate(req.user.id, userImagePath);
  }
  @UseGuards(AuthGuard)
  @Post('update')
  async updateProfile(@Request() req: NewRequest, @Body() data: any) {
    console.log(data);
    return this.userService.updateUser(req.user.id, data);
  }
  @UseGuards(AuthGuard)
  @Post('event-register')
  async eventRegister(@Request() req: NewRequest, @Body() data: any) {
    return this.userService.updateUser(req.user.id, data);
  }
  @UseGuards(AuthGuard)
  @Post('event-unregister')
  async eventUnregister(@Request() req: NewRequest, @Body() data: any) {
    return this.userService.updateUser(req.user.id, data);
  }
}
