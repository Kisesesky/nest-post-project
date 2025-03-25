import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { DataSource } from "typeorm";
import 'dotenv/config'
import { DbConfigService } from './config/db/config.service';
import { PostViewSubscriber } from './modules/posts/subscribers/post-view.subscriber';
import { CommentSubscriber } from './modules/comments/subscribers/comments-view.subscriber';
import { UserSubscriber } from './modules/users/subscribers/user.subscriber';

const entity = join(__dirname, '/**/*.entity{.ts,.js}')
const migration = join(__dirname, './migrations/**/*{.ts,.js}'); 

const configServicer = new ConfigService()
const dbconfigService = new DbConfigService(configServicer)

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: dbconfigService.dbHost,
    port: dbconfigService.dbPort,
    username: dbconfigService.dbUser,
    password: dbconfigService.dbPassword,
    database: dbconfigService.dbName,
    ssl:{
          rejectUnauthorized: false,
        },
    synchronize: false, //Migrations = synchronize: false
    entities: [entity],
    migrations: [migration],
    logging: true,
    subscribers: [PostViewSubscriber, CommentSubscriber, UserSubscriber],
});
