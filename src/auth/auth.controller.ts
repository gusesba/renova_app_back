import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

import { Response } from 'express'; // IMPORT CORRETO

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() input: { email: string; password: string }, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.authenticate(input);
    if (!result) {
      return { message: 'Invalid credentials' };
    }
    res.cookie('token', result.token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        path: '/',
    });
    return { message: 'Login realizado com sucesso' };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getUserInfo(@Request() request) {
    return request.user;
  }
}
