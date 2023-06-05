import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard('local'))
  @Post('app/login')
  async login(@Request() req) {
    return req.user;
  }

  @Get()
  getData() {
    return this.appService.getData();
  }
}
