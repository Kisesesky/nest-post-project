import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./configuration";
import { AwsConfigService } from './config.service';
import * as Joi from 'joi'

@Module({
    imports: [
    ConfigModule.forRoot({
            load: [configuration],
            validationSchema: Joi.object({
                AWS_ACCESS_KEY_ID: Joi.string().required(),
                AWS_SECRET_ACCESS_KEY: Joi.string().required(),
                AWS_BUCKET_NAME: Joi.string().required(),
                AWS_REGION: Joi.string().required(),
            }),
            isGlobal: true,
        })
    ],
    providers: [ConfigService, AwsConfigService],
    exports: [ConfigService, AwsConfigService],
})
export class AwsConfigModule {}