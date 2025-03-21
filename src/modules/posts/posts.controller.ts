import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestUser } from '../../decorators/rerquest-user.decorator';
import { User } from './../users/entities/user.entity';
import { Roles } from '../../decorators/role.decorator';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ListAllPostDto } from './dto/list-all-post.dto';
import { PostRoleGuard } from './guards/post-role.guards';

@UseGuards(JwtAuthGuard)
@ApiTags('Post User')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService
    ) {}

  @ApiOperation({
    summary: '게시글 등록',
    description: '게시글 등록 api 입니다.',
  })
  @ApiBody({ type: CreatePostDto })
  @Post()
  async createPost(@Body() createPostDto: CreatePostDto, @RequestUser() user: User) {
    return await this.postsService.createPost(createPostDto, user)
  }


  @ApiOperation({ summary: '게시글 찾기' })
  @Get()
  findAllPost(@Query() listAllPostDto: ListAllPostDto) {
    return this.postsService.findAll(listAllPostDto)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @RequestUser() user:User) {
    return this.postsService.findOne(id, user)
  }
  
  @ApiOperation({ summary: '게시글 수정' })
  @UseGuards(PostRoleGuard)
  @Patch(':postId')
  update(@Param('postId') postId: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.updatePost(postId, updatePostDto);
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @UseGuards(PostRoleGuard)
  @Delete(':postId')
  remove(@Param('postId') postId: string) {
    return this.postsService.removePost(postId);
  }


}
