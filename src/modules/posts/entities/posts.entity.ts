import { BaseEntity } from "../../../common/entities/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { User } from '../../users/entities/user.entity';
import { Comment } from "../../comments/entities/comment.entity";
import { PostView } from './post-view.entity';

@Entity()
export class Post extends BaseEntity {
    
    @Column()
    title: string

    @Column()
    content: string

    @Column()
    thumbnailUrl: string

    @Column({ default: 0 })
    views: number

    @Column({ default: 0})
    commentCount: number

    @ManyToOne(()=>User, (user)=>user.posts)
    user: User

    @OneToMany(()=> PostView, (postView)=>postView.post, { cascade: true })
    postView: PostView[]

    @OneToMany(()=>Comment, (comment)=> comment.post, { cascade: true })
    comments: Comment[]

}