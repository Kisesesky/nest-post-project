import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Module } from '../s3/s3.module';
import { Image } from './entities/image.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Image]), S3Module],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
