import { ForbiddenException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { Repository } from "typeorm";
import { Comment } from "../entities/comment.entity";
import { User } from '../../../modules/users/entities/user.entity';
import { UserRoleOption } from '../../../modules/users/entities/user.entity';


@Injectable()
export class CommentRoleGuard implements CanActivate {
    constructor(@InjectRepository(Comment) private commentRepository: Repository<Comment>) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>()
        const user = request.user as User
        const commentId = request.params.commentId

        const comment = await this.commentRepository.findOne({ where: { id: commentId }, relations: ['user']})
        if(!comment) {
            throw new ForbiddenException('댓글을 찾을수 없습비다.')
        }

        return user.id === comment.user.id || user.role === UserRoleOption.ADMIN
    }
}