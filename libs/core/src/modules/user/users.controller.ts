import { Controller, Body, Param, UseGuards, Get, Put, Delete, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
// import { JwtAuthGuard } from '@nft/api-modules/auth/guards/jwt-auth.guard';
import RouteTokens from '@nft/user-api-core/constants/open-api.constants';
import { ApiRolesType, API_ROLES } from '@nft/core-lib';
import { UserGetResponse, UserPostResponse } from './user.decorator';
import { UserGuard } from './user.guard';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProfileDto } from './dto/profile.dto';
import { Request } from 'express';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiBearerAuth()
  @UserGetResponse({ isArray: true })
  async findAll(@Req() request: Request) {
    const jwt = request.headers.authorization.replace('Bearer ', '');
    return await this.userService.getUserAllWithJwt(jwt);
  }

  @Get(RouteTokens.user_id)
  @ApiParam({ name: 'userId', type: String, required: true })
  @UserGetResponse({ type: ProfileDto })
  async findOne(@Param('userId') userId: string): Promise<User> {
    const result = await this.userService.getUserById(userId);
    if (result !== null) {
      return result;
    }
    // If the aggregate fails due to the user not having shared items, result will be null
    return await this.userService.findOne(userId);
  }

  @Delete(RouteTokens.user_id)
  @ApiParam({ name: 'userId', type: String, required: true })
  @UseGuards(UserGuard)
  remove(@Param('userId') userId: string): Promise<DeleteResult> {
    return this.userService.remove(userId);
  }

  @Put(RouteTokens.user_id)
  @UseGuards(UserGuard)
  @ApiParam({ name: 'userId', type: String, required: true })
  @ApiBody({ type: UpdateUserDto })
  @UserPostResponse({ type: UserDto })
  update(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser({ userId, updateUserDto });
  }

  @Put(':userId/roles')
  @ApiBody({ enum: API_ROLES })
  @UserPostResponse({ type: UserDto })
  setRoles(@Param('userId') id: string, @Body() params: { roles: ApiRolesType[] }) {
    const { roles = [] } = params;
    return this.userService.setRoles(id, roles);
  }
}
