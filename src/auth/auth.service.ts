import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Attendee, Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<{ access_token: string } | null> {
    const user = await this.prisma.attendee.findUnique({
      where: { email: email },
    });
    if (user && user.password === password) {
      const obj = {
        id: user.id,
        email: user.email,
        name: user.name,
      };
      return {
        access_token: await this.jwtService.signAsync(obj),
      };
    }
    throw new UnauthorizedException();
  }

  async registerUser(data: Prisma.AttendeeCreateInput): Promise<Attendee> {
    const user = await this.prisma.attendee.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    });
    return user;
  }
}
