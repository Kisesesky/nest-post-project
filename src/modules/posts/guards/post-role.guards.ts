import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "../entities/posts.entity";
import { Repository } from 'typeorm';
import { Request } from "express";
import { User, UserRoleOption } from '../../../modules/users/entities/user.entity';


@Injectable()
export class PostRoleGuard implements CanActivate {
    constructor(@InjectRepository(Post) private postRepository: Repository<Post>){}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>()
        const user = request.user as User
        const postId = request.params.postId
        const post = await this.postRepository.findOne({ where: {id: postId}, relations: ['user']})
        if(!post){
            throw new ForbiddenException('게시물을 찾을수 없습니다.')
        }
        return user.id === post.user.id || user.role === UserRoleOption.ADMIN
    }
}