import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Post } from '../../../modules/posts/entities/posts.entity';


@EventSubscriber()
export class CommentSubscriber implements EntitySubscriberInterface<Comment> {
  listenTo() {
    return Comment;
  }

  async afterInsert(event: InsertEvent<Comment>) {
    const postRepository = event.manager.getRepository(Post);

    await postRepository.increment(
      { id: event.entity.post.id },
      'commentCount',
      1,
    );
  }

  // async beforeRemove(event: RemoveEvent<Comment>) {
  //   const postRepository = event.manager.getRepository(Post);
  //   const commentRepository = event.manager.getRepository(Comment)

  //   const count = await commentRepository
  //     .createQueryBuilder('c')
  //     .where('c.id=:id', { id: event.entity?.id })
  //     .orWhere('c.parent=:id', { id: event.entity?.id })
  //     .getCount()
    
  //   await postRepository.decrement(
  //     { id: event.entity?.post.id },
  //     'commentCount',
  //     count,
  //   )
  // }

  async afterRemove(event: RemoveEvent<Comment>) {
    const postRepository = event.manager.getRepository(Post);

    await postRepository.decrement(
      { id: event.entity?.post.id },
      'commentCount',
      1 + (event.entity?.replies.length || 0),
    )
  }
  
}