import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PostsService } from './../posts/posts.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';


@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private postsService: PostsService
  ) {}
  async addComment(user: User, postId: string, createCommentDto: CreateCommentDto) {
    const post = await this.postsService.findPostById(postId)
    if(!post) {
      throw new NotFoundException('등록된 포스트가 없습니다.')
    }

    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      user,
      post
    })
    await this.commentRepository.save(comment)

    //댓글 저장
    // await this.commentRepository.createQueryBuilder()
    //   .update('post')
    //   .set({
    //     comment: () =>'comment + 1'
    //   })
    //   .where('id = :postId', { postId: post.id })
    //   .execute()
    // 단순 db 댓글 저장
    // post.comment++
    // await this.commentRepository.manager.save(post)

    return comment

  }

  async createReply (createCommentDto: CreateCommentDto, user: User, postId: string, commentId: string) {
    const post = await this.postsService.findPostById(postId)
    if(!post) {
      throw new NotFoundException('등록된 포스트가 없습니다.')
    }
    const parent = await this.commentRepository.findOne({ where: { id: commentId } })
    if(!parent) {
      throw new NotFoundException('등록된 댓글이 없습니다.')
    }

    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      user,
      post,
      parent
    })
    return await this.commentRepository.save(comment)
  }

  async findCommentsByPostId(postId: string, limit: number) {
    // const data = await this.commentRepository.find({
    //   relations: ['user', 'replies', 'replies.user'],
    //   where: {
    //     post: { id: postId},
    //     parent: IsNull()
    //   },
    //   order: { createdAt: OrderOption.DESC},
    //   take: limit,
    //   select: {
    //     user: {
    //       id: true,
    //       name: true
    //     },
    //     replies: {
    //       id: true,
    //       content: true,
    //       createdAt: true,
    //       user: {
    //         id: true,
    //         name: true
    //       }
    //     }
    //   }
    // })
    const data = await this.commentRepository.createQueryBuilder('c')
      .leftJoin('c.user', 'u')
      .leftJoin('c.replies', 'r')
      .leftJoin('r.user', 'ru')
      .andWhere('c.postId = :postId', { postId })
      .andWhere('c.parentId IS NULL')
      .take(limit)
      .select([
        'c.id',
        'c.content',
        'c.createdAt',
        'u.id',
        'u.name',
        'r.id',
        'r.content',
        'r.createdAt',
        'ru.id',
        'ru.name'
      ])
      .getMany()

    return { data }
  }

  findOne(commentId: string) {
    return `This action returns a #${commentId} comment`;
  }

  async updateComment(commentId: string, updateCommentDto: UpdateCommentDto) {
    // const comment = await this.commentRepository.findOne({ where: { id: commentId }})
    // if(!comment) {
    //    throw new NotFoundException('해당하는 댓글이 없습니다.')
    // }
    // comment.content = updateCommentDto.content
    // return await this.commentRepository.save(comment)

    const result = await this.commentRepository.update(commentId, {
      content: updateCommentDto.content
    })
    if(result.affected === 0) {
      throw new NotFoundException('해당하는 댓글이 없습니다.')
    }
    return result
  }

  async removeComment(commentId: string) {
    const comment = await this.commentRepository.findOne({ where: { id: commentId }, relations :['post', 'replies']})
    if(!comment){
      throw new NotFoundException('해당한는 댓글이 없습니다.')
    }
    return await this.commentRepository.remove(comment)
  }
  //   const result = await this.commentRepository.delete(commentId)
  //   if(result.affected === 0) {
  //     throw new NotFoundException('해당하는 댓글이 없습니다.')
  //   }
  //   return result
  // }
}
