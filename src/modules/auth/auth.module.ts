import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from './../users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AppConfigModule } from '../../config/app/config.module';
import { AppConfigService } from './../../config/app/config.service';
import { S3Module } from '../s3/s3.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { SocialConfigModule } from '../../config/social/config.module';



@Module({
  imports: [
    S3Module,
    AppConfigModule,
    SocialConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: (appConfigService: AppConfigService) => ({
        secret: appConfigService.jwtSecret,
        signOptions: {expiresIn:'1h'}
      }),
      inject: [AppConfigService]
    }),
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
