import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Attendee, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserInfo(id: string): Promise<Attendee | null> {
    const user = await this.prisma.attendee.findUnique({
      where: { id },
      include: { events: true, favourites: true },
    });
    if (user.name && user.email) {
      return user;
    }
    return null;
  }
  async getAttendees(): Promise<Attendee[]> {
    const users = await this.prisma.attendee.findMany({
      include: { events: true, favourites: true },
    });
    return users;
  }
  async updateUser(
    id: string,
    data: Prisma.AttendeeUpdateInput,
  ): Promise<Attendee> {
    return await this.prisma.attendee.update({
      where: { id },
      data: {
        events: data.events,
        favourites: data.favourites,
      },
    });
  }
}
