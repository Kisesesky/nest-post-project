import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./configuration";
import { AppConfigService } from './config.service';
import * as Joi from 'joi'

@Module({
    imports: [
    ConfigModule.forRoot({
            load: [configuration],
            validationSchema: Joi.object({
                JWT_SECRET: Joi.string().required(),
                JWT_REFRESH_SECRET: Joi.string().required(),
                PORT: Joi.number().required(),
            }),
            isGlobal: true,
        })
    ],
    providers: [ConfigService, AppConfigService],
    exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}