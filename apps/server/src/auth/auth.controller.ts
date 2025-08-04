import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { type User } from '@message-app/schemas';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @ApiOkResponse({})
  @ApiBadRequestResponse({})
  // @UseGuards(LocalAuthGuard)
  @Post('signup')
  async signUp(@Body() signUpDto: User) {
    const result = await this.authService.signUp(signUpDto);
    console.log(result);
  }
}
