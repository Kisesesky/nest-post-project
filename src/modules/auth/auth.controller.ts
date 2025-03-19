import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, NotAcceptableException, Res, UseInterceptors, UploadedFile, UseGuards, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ResponseRegisterDto } from './dto/response-register.dto';
import { User } from './../users/entities/user.entity';
import { LogInDto } from './dto/log-in.dto';
import { RequestOrigin } from 'src/decorators/request-origin.decorator';
import { Response } from 'express';
import { ResponseLogInDto } from './dto/response-log-in.dto';
import { RolesGuard } from './role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RequestUser } from '../../decorators/rerquest-user.decorator';

@ApiTags('Authorize User')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '유저등록',
    description: '유저 로그인, 유저 등록 api 입니다.',
  })
  @ApiResponse({
    type: ResponseRegisterDto,
    status: HttpStatus.CREATED,
  })
  @ApiBody({
    type: RegisterDto,
  })
  @Post('signup')
  async register(@Body() registerDto: RegisterDto):Promise<ResponseRegisterDto> {
      return this.authService.register(registerDto);
    }
  
  @ApiOperation({
    summary: '유저 로그인',
    description: '유저 로그인 Api'
  })
  @ApiBody({
    type: LogInDto
  })
  @Post('signin')
  async signIn(@Body() logInDto: LogInDto, @RequestOrigin() origin, @Res() res: Response) {
    const { accessToken, refreshToken, accessOptions, refreshOptions } = await this.authService.logIn(logInDto, origin)

    res.cookie('Authentication', accessToken, accessOptions)
    res.cookie('Refresh', refreshToken, refreshOptions)

    return res.json({
      message: '로그인 성공',
      accessToken: accessToken,
      refreshToken: refreshToken
    })

  }
  @ApiOperation({
    summary: '유저 로그아웃',
    description: '유저 로그아웃 Api'
  })
  @Post('signout')
  signOut(@Res () res:Response, @RequestOrigin() origin: string) {
    const { accessOptions, refreshOptions} = this.authService.expireJwtToken(origin)

    res.cookie('Authentication', '', accessOptions)
    res.cookie('Refresh', '', refreshOptions)

    res.json({
      message: '로그아웃 완료'
    })

  }
  // @UseInterceptors(FileInterceptor('file'))
  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({
  //   summary: '프로필 업로드',
  //   description: '유저 프로필 업로드 입니다.',
  // })
  // @Post('upload-profile')
  // async uploadProfile(@UploadedFile() file: Express.Multer.File, @RequestUser() user:User) {
  //   const resultUrl = await this.authService.uploadProfile(file)
  //   return { resultUrl }
  // }

  @UseGuards(JwtAuthGuard)
  @Get('google/login')
  async googleAuth(@Req() req){
    console.log('GET google/login')
  }

  @UseGuards(JwtAuthGuard)
  @Get('oauth2/redirect/google')
  async googleAuthRedirect(@Req() req, @Res() res){
    const { user } = req
    return res.send(user)
  }

}