import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/decorators/rerquest-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentRoleGuard } from './guards/comment-role.guards';

@Controller('posts/:postId/comments')
@ApiTags('Comments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService
    ) {}
  
  @ApiOperation({
    summary: '댓글 등록',
    description: '댓글 등록 Api'
  })
  @ApiBody({ type: CreateCommentDto })
  @ApiParam({ name: 'postId',type: String, description: 'comment' })
  @Post()
  async createComment(@Body() createCommentDto: CreateCommentDto, @Param('postId') postId: string, @RequestUser() user: User) {
    return await this.commentsService.addComment(user, postId, createCommentDto);
  }

  @Post(':commentId/replies')
  @ApiOperation({
    summary: '대댓글 등록',
    description: '대댓글 등록 Api'
  })
  @ApiParam({ name: 'postId',type: String, description: 'comment' })
  @ApiParam({ name: 'commentId',type: String, description: 'comment' })
  createReply(@Body() createComment: CreateCommentDto, @Param('postId') posttId: string, @Param('commentId') commentId: string, @RequestUser() user: User) {
    return this.commentsService.createReply(
      createComment,
      user,
      posttId,
      commentId
    )
  }
  
  @ApiOperation({
    summary: '댓글 찾기',
    description: '댓글 찾기 Api'
  })
  @Get()
  @ApiParam({ name: 'postId',type: String, description: 'comment list' })
  findAll(@Param('postId') postId: string, @Query('limit') limit: number = 10) {
    return this.commentsService.findCommentsByPostId(postId, limit);
  }

  @Get(':id')
  findOne(@Param('commentId') commentId: string) {
    return this.commentsService.findOne(commentId);
  }

  @ApiOperation({
    summary: '댓글 수정',
    description: '댓글 수정 Api'
  })
  @Patch(':commentId')
  @UseGuards(CommentRoleGuard)
  update(@Param('commentId') commentId: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.updateComment(commentId, updateCommentDto);
  }

  @ApiOperation({
    summary: '댓글 삭제',
    description: '댓글 삭제 Api'
  })
  @Delete(':commentId')
  @UseGuards(CommentRoleGuard)
  @HttpCode(204)
  remove(@Param('commentId') commentId: string) {
    return this.commentsService.removeComment(commentId);
  }
}
