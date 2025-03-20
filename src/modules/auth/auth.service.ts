import { Injectable, UnauthorizedException, UploadedFile } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from './../users/users.service';
import { comparePassword, encryptPassword } from '../../utils/password-util';
import { ResponseRegisterDto } from './dto/response-register.dto';
import { LogInDto } from './dto/log-in.dto';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions } from 'express';
import { AppConfigService } from './../../config/app/config.service';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private appConfigService: AppConfigService,
    private s3Service: S3Service
  ) {}
  async register(registerDto: RegisterDto):Promise<ResponseRegisterDto> {
    return this.usersService.createUser(registerDto)
  }

  async logIn(logInDto: LogInDto, origin: string) {
    const user = await this.usersService.findUserByEmail(logInDto.email)

    if(!await comparePassword(logInDto.password, user.password))
      throw new UnauthorizedException('이메일 또는 패스워드가 잘 못 되었습니다.')

    const { accessToken, accessOptions } = this.setJwtAccessToken(logInDto.email, origin)

    const { refreshToken, refreshOptions } = this.setJwtRefreshToken(logInDto.email, origin)

    return {
      accessToken,
      accessOptions,
      refreshToken,
      refreshOptions
    }

  }

  setCookieOption(maxAge: number, requestDomain: string):CookieOptions {
    let domain: string;

    if(
      requestDomain.includes('127.0.0.1') || requestDomain.includes('localhost')
    )
    domain = 'localhost'
    else {
      domain = requestDomain.split(':')[0];
    }
    return {
      domain,
      path: '/',
      httpOnly: true,
      maxAge,
      sameSite: 'lax'
    }
  }

  setJwtAccessToken(email: string, requestDomain: string) {
    const payload = { sub: email }
    const maxAge = 3600 * 1000 //1h
    const token = this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtSecret,
      expiresIn: maxAge
    })
    return {
      accessToken: token,
      accessOptions: this.setCookieOption(maxAge, requestDomain)
    }
  }

  setJwtRefreshToken(email: string, requestDomain: string) {
    const payload = { sub: email }
    const maxAge = 30 * 24 * 3600 * 1000 
    const token = this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtRefreshSecret,
      expiresIn: maxAge
    })
    return {
      refreshToken: token,
      refreshOptions: this.setCookieOption(maxAge, requestDomain)
    }
  }

  expireJwtToken(requestDomain: string) {
    return {
      accessOptions: this.setCookieOption(0, requestDomain),
      refreshOptions: this.setCookieOption(0, requestDomain)
    }
  }

  // async uploadProfile(file: Express.Multer.File, dirPath:string) {
  //   return await this.s3Service.uploadFile(file,dirPath)
  // }
}