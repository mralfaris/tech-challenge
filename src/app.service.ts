import { Injectable, HttpService, Get, Param, Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AxiosResponse } from 'axios'
import { response } from 'express';
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { api } from './api.constants';
import { serialize } from 'class-transformer';

@Injectable()
export class AppService {

  constructor(
    private httpService: HttpService
  ) { }
  
  @Get('users')
  findAllUsers() {
    return this.httpService.get(api.host + '/' + api.user).pipe(
      map(response => response.data));
  }

  @UseGuards(JwtAuthGuard)
  @Get('albums')
  findAlbums(@Request() req) {
    return this.httpService.get(api.host + '/' + api.user + '/' + req.user.userId + '/' + api.album).pipe(map(response => response.data));
  }

  @UseGuards(JwtAuthGuard)
  @Get('albums/:id')
  findAlbumById(@Param('id') id) {
    return this.httpService.get(api.host + '/' + api.album + '/' + id).pipe(map(response => response.data));
  }

  findAlbumIDs(@Request() req) {
    return this.httpService.get(api.host + '/' + api.user + '/' + req.user.userId + '/' + api.album).pipe(map(response => response.data.map(album => ({
      id: album.id
    }))));
  }

  @UseGuards(JwtAuthGuard)
  @Get('photos')
  findPhotos(@Request() req) {
    let userAlbums = this.httpService.get(api.host + '/' + api.user + '/' + req.user.userId + '/' + api.album).pipe(map(response => response.data.map(album => ({
      id: album.id
    }))));
    let albumIds = [];
    userAlbums.forEach(album => {
      album.forEach(singleAlbum => {
        albumIds.push(singleAlbum.id);
        console.log(singleAlbum.id);
      })
    });

    let allPhotos = this.httpService.get(api.host + '/' + api.photo).pipe(map(response => response.data));
    var resPhotos = [];

    allPhotos.forEach(photo => {
      photo.forEach(singlePhoto => {
        if (albumIds.includes(singlePhoto.albumId)) {
          let record = '{"albumId": ' + singlePhoto.albumId + ', "id": ' + singlePhoto.id +
            ',"title": "' + singlePhoto.title +
            '","url": "' + singlePhoto.url +
            '","thumbnailUrl": "' + singlePhoto.thumbnailUrl +
            '"}"';
          console.log(record);
          resPhotos.push(record);
        }
      })
    });

    return resPhotos;
  }

  @UseGuards(JwtAuthGuard)
  @Get('photos/:id')
  findPhotoById(@Param('id') id) {
    return this.httpService.get(api.host + '/' + api.photo + '/' + id).pipe(map(response => response.data));
  }
}