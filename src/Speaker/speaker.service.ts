import { Injectable } from '@nestjs/common';
import { Prisma, Speaker } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SpeakerService {
  constructor(private prisma: PrismaService) {}
  async speakers(): Promise<Speaker[]> {
    return await this.prisma.speaker.findMany({
      include: { event: true },
    });
  }
  async speaker(id: string): Promise<Speaker> {
    return await this.prisma.speaker.findUnique({
      where: { id: id },
    });
  }
  async createSpeaker(data: Prisma.SpeakerCreateInput): Promise<Speaker> {
    console.log(data);
    return await this.prisma.speaker.create({
      data,
    });
  }
  async updateSpeaker(params: {
    where: Prisma.SpeakerWhereUniqueInput;
    data: Prisma.SpeakerUpdateInput;
  }): Promise<Speaker> {
    const { where, data } = params;
    return await this.prisma.speaker.update({
      data,
      where,
    });
  }
  async deleteSpeaker(where: Prisma.SpeakerWhereUniqueInput): Promise<Speaker> {
    return await this.prisma.speaker.delete({
      where,
    });
  }
}
