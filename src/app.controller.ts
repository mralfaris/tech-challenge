import { Controller, Get, Param, Request, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { AxiosResponse } from 'axios'
import { Observable } from 'rxjs'
import { LocalAuthGuard } from './auth/local-auth.guard'
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('users')
  findAllUsers() {
    return this.appService.findAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('albums')
  findAlbums(@Request() req) {
    return this.appService.findAlbums(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('albums/:id')
  findAlbumById(@Param('id') id){
    return this.appService.findAlbumById(id); 
  }

  @UseGuards(JwtAuthGuard)
  @Get('photos')
  findPhotos(@Request() req) {
    return this.appService.findPhotos(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('photos/:id')
  findPhotoById(@Param('id') id){
    return this.appService.findPhotoById(id); 
  }
}