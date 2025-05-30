// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UserService
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password && await bcrypt.compare(password, user.password)) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: Users) {
    const errorMessages: string[] = [];

    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '3d'
    });

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return { data: { accessToken, refreshToken }, errorMessages };
  }

  async refreshToken(userId: number, refreshToken: string) {
    const errorMessages: string[] = [];
    const user = await this.usersService.findOneForAuth(userId);

    if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    return { 
      data: { 
        accessToken,
      }, 
      errorMessages 
    };
  }

  async logout(userId: number) {
    const errorMessages: string[] = [];
    const user = this.usersService.updateRefreshToken(userId, null);

    return { data: user, errorMessages}
  }
}
