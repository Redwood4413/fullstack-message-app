import { Controller, Get, Param } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from '@message-app/server';
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOkResponse({})
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get('find/:id')
  async getUserById(@Param('id') id: string): Promise<User | null> {
    return this.userService.user({ id });
  }
}
