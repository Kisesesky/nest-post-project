import { Entity, ManyToOne } from "typeorm";
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from './../../users/entities/user.entity';
import { Post } from "./posts.entity";

@Entity()
export class PostView extends BaseEntity {
    @ManyToOne(()=>User)
    user: User

    @ManyToOne(()=>Post)
    post: Post

}