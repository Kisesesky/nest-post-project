import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from '../../../common/entities/base.entity';
import { Post } from '../../posts/entities/posts.entity';
import { Comment } from './../../comments/entities/comment.entity';

export enum UserRoleOption {
    ADMIN = 'admin',
    COMMON = 'common'
}

export enum RegisterType {
    GOOGLE = 'google',
    NAVER = 'naver',
    KAKAKO = 'kakao',
    COMMON = 'common'

}

@Entity()
export class User extends BaseEntity {
    @Column()
    name: string;
    
    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    socialId: string

    @Column({ type:'enum', enum: RegisterType, default: RegisterType.COMMON })
    registerType: RegisterType

    @Column({ enum: UserRoleOption, default: UserRoleOption.COMMON })
    role: UserRoleOption

    @OneToMany(()=>Post, (post)=>post.user, {
        cascade: ['insert', 'soft-remove', 'recover']
    })
    posts: Post[]

    @OneToMany(()=>Comment, (comment)=>comment.user)
    comments: Comment[]
    
}