import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { S3Service } from './../s3/s3.service';
import { Express } from 'express';

@Injectable()
export class ImagesService {
    constructor(@InjectRepository(Image) private imageRepository: Repository<Image>, private s3Service: S3Service) {}
    
    
    async uploadImage(file: Express.Multer.File, dirPath: string) {
        const filePath = 'image'
        const resultUrl = await this.s3Service.uploadFile(file, filePath)
        const image = this.imageRepository.create({
            imageUrl: resultUrl,
            filePath 
        })
        await this.imageRepository.save(image)
        return { resultUrl }
    }
}
