import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Event, Prisma } from '@prisma/client';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}
  async events(limit?: number): Promise<Event[]> {
    if (limit) {
      return this.prisma.event.findMany({
        take: limit,
        include: { location: true, speakers: true, attendees: true },
      });
    }
    return await this.prisma.event.findMany({
      include: { location: true, speakers: true, attendees: true },
    });
  }
  async event(id: string): Promise<Event> {
    return await this.prisma.event.findUnique({
      where: { id: id },
      include: { location: true, speakers: true, attendees: true },
    });
  }
  async createEvent(data): Promise<Event> {
    console.log('Data to create', data);
    const users = this.prisma.attendee.findMany();
    const response = await this.prisma.event.create({
      data,
    });
    (await users).forEach(async (user) => {
      await this.prisma.notification.create({
        data: {
          message:
            `Hello ${user.name}, there's an event ` +
            response.name +
            ' on ' +
            new Date(response.date).toDateString() +
            'Check it out!',
          attendeeId: user.id,
          eventId: response.id,
        },
      });
    });
    return response;
  }
  async updateEvent(params: {
    where: Prisma.EventWhereUniqueInput;
    data: Prisma.EventUpdateInput;
  }): Promise<Event> {
    const { where, data } = params;
    return await this.prisma.event.update({
      data,
      where,
    });
  }
  async deleteEvent(where: Prisma.EventWhereUniqueInput): Promise<Event> {
    return await this.prisma.event.delete({
      where,
    });
  }
}
