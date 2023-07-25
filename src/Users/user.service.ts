import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Attendee } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserInfo(id: string): Promise<Attendee | null> {
    const user = await this.prisma.attendee.findUnique({
      where: { id },
      include: { events: true, favourites: true, notifications: true },
    });
    if (user.name && user.email) {
      return user;
    }
    return null;
  }
  async getAttendees(): Promise<Attendee[]> {
    const users = await this.prisma.attendee.findMany({
      include: { events: true, favourites: true, notifications: true },
    });
    return users;
  }
  // Use this to update the user's favourites and events
  async updateUser(id: string, data: any): Promise<Attendee> {
    console.log(data);
    return await this.prisma.attendee.update({
      where: { id },
      data: {
        events: {
          connect: {
            id: data.events,
          },
        },
        favourites: data.favourites,
      },
    });
  }
  async normalUpdate(id: string, image: string) {
    return await this.prisma.attendee.update({
      where: { id },
      data: {
        imageUrl: image,
      },
    });
  }
}
