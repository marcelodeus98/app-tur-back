import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateAuthLoginDto } from './dto/create-auth-login-dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  @ApiBody({ type: CreateAuthLoginDto })
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiBadRequestResponse({ description: 'Invalid refresh token' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    return this.authService.logout(req.user.id);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({ status: 200, description: 'Refresh token successful' })
  @ApiBadRequestResponse({ description: 'Invalid refresh token' })
  @Post('revalidate')
  async revalidate(@Req() req) {
    return this.authService.refreshToken(
      req.user.sub,
      req.body.refreshToken
    );
  }
}
