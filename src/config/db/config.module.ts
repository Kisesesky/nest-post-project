import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./configuration";
import { DbConfigService } from './config.service';
import * as Joi from 'joi'

@Module({
    imports: [
    ConfigModule.forRoot({
            load: [configuration],
            validationSchema: Joi.object({
                DATABASE_HOST: Joi.string().required(),
                DATABASE_PORT: Joi.number().required(),
                DATABASE_USER: Joi.string().required(),
                DATABASE_PASSWORD: Joi.string().required(),
                DATABASE_NAME: Joi.string().required(),
                NODE_ENV: Joi.string().required()
            }),
            isGlobal: true,
        })
    ],
    providers: [ConfigService, DbConfigService],
    exports: [ConfigService, DbConfigService],
})
export class DbConfigModule {}