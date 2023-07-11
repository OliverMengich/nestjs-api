import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Attendee } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Attendee | null> {
    const user = await this.prisma.attendee.findUnique({
      where: { email: email },
    });
    if (user && user.password === password) {
      return user;
    }
    throw new UnauthorizedException();
  }

  async registerUser(
    email: string,
    password: string,
    name: string,
  ): Promise<Attendee> {
    const user = await this.prisma.attendee.create({
      data: {
        email: email,
        password: password,
        name: name,
      },
    });
    return user;
  }
}
