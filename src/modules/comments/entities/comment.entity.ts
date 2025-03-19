import { BaseEntity } from "../../../common/entities/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Post } from "../../../modules/posts/entities/posts.entity";
import { User } from "src/modules/users/entities/user.entity";

@Entity()
export class Comment extends BaseEntity {
    @Column()
    content: string

    @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
    post: Post

    @ManyToOne(() => User, (user)=>user.comments, { onDelete: 'CASCADE' })
    user: User

    @OneToMany(()=>Comment, (comment)=>comment.parent)
    replies: Comment[]

    @ManyToOne(()=>Comment, (comment)=>comment.replies, {
        onDelete: 'CASCADE'
    })
    parent: Comment
}
