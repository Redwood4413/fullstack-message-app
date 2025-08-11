import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { PrismaClient } from 'prisma';
import z from 'zod';
import { registerSchema } from 'validation';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @ApiOkResponse({})
  @ApiBadRequestResponse({})
  // @UseGuards(LocalAuthGuard)
  @Post('signup')
  async signUp(@Body() signUpDto: z.input<typeof registerSchema>) {
    const result = await this.authService.signUp(signUpDto);
  }
}
