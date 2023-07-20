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
        include: { location: true, speaker: true, attendees: true },
      });
    }
    return await this.prisma.event.findMany({
      include: { location: true, speaker: true, attendees: true },
    });
  }
  async event(id: string): Promise<Event> {
    return await this.prisma.event.findUnique({
      where: { id: id },
      include: { location: true, speaker: true },
    });
  }
  async createEvent(data): Promise<Event> {
    console.log('Data to create', data);
    return await this.prisma.event.create({
      data,
    });
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
