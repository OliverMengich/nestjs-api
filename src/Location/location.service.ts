import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Location } from '@prisma/client';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}
  async locations(): Promise<Location[]> {
    return await this.prisma.location.findMany();
  }
  async location(id: string): Promise<Location> {
    return await this.prisma.location.findUnique({
      where: { id },
    });
  }
  async createLocation(data: Prisma.LocationCreateInput): Promise<Location> {
    console.log(data);
    return await this.prisma.location.create({
      data,
    });
  }
  async updateLocation(params: {
    where: Prisma.LocationWhereUniqueInput;
    data: Prisma.LocationUpdateInput;
  }) {
    const { where, data } = params;
    return await this.prisma.location.update({
      data,
      where,
    });
  }
  async deleteLocation(where: Prisma.LocationWhereUniqueInput) {
    return await this.prisma.location.delete({
      where,
    });
  }
}
