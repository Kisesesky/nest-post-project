import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ImageUploadDto } from './dto/image-upload.dto';
import { ImagesService } from './images.service';

@ApiTags('image')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '이미지 등록',
    description: '이미지 등록 api 입니다.',
  })
  @ApiBody({ description: '이미지 업로드 ',schema: { type: 'object', properties : { file: { type: 'string', format: 'binary' }}} })
  @Post('upload')
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.imagesService.uploadImage(file, 'user-profile')
  }
}
