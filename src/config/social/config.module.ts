import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./configuration";
import { SocialConfigService } from './config.service';
import * as Joi from 'joi'

@Module({
    imports: [
    ConfigModule.forRoot({
            load: [configuration],
            validationSchema: Joi.object({
                GOOGLE_CLIENT_ID: Joi.string().required(),
                GOOGLE_CLIENT_SECRET: Joi.string().required(),
                GOOGLE_CLIENT_CALLBACKURL: Joi.string().required()
            }),
            isGlobal: true,
        })
    ],
    providers: [ConfigService, SocialConfigService],
    exports: [ConfigService, SocialConfigService],
})
export class SocialConfigModule {}