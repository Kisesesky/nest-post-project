import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { RegisterType } from "src/modules/users/entities/user.entity";
import { SocialConfigService } from "../../../config/social/config.service";
import { UsersService } from './../../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy,'google') {
    constructor(
        private socialConfigService: SocialConfigService,
        private usersService: UsersService
    ) {
        super({
            clientID: socialConfigService.googleClientId as string,
            clientSecret: socialConfigService.googleClientSecret as string,
            callbackURL: socialConfigService.googleClientCallBackUrl,
            scope: ['email', 'profile'],
        })
    }

    async validate(accessToken: string, refreshToken: string, profile:Profile, done: VerifyCallback) {
        //user가 있는경우
        const user = await this.usersService.findUserBySocialId(profile._json.sub, RegisterType.GOOGLE)
        if(user) {
            done(null, user)
            return
        }
        //user가 없는경우 회원가입
        const newUser = await this.usersService.createUser({
            email: profile._json.sub as string,
            socialId: profile._json.sub,
            name: profile._json.name || '',
            registerType: RegisterType.GOOGLE
        })

        done(null, newUser)
    }
}