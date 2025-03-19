import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from '../../../common/entities/base.entity';
import { Post } from '../../posts/entities/posts.entity';
import { Comment } from './../../comments/entities/comment.entity';

export enum UserRoleOption {
    ADMIN = 'admin',
    COMMON = 'common'
}

@Entity()
export class User extends BaseEntity {
    @Column()
    name: string;
    
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ enum: UserRoleOption, default: UserRoleOption.COMMON })
    role: UserRoleOption

    @OneToMany(()=>Post, (post)=>post.user, {
        cascade: ['insert', 'soft-remove', 'recover']
    })
    posts: Post[]

    @OneToMany(()=>Comment, (comment)=>comment.user)
    comments: Comment[]
    
}