import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
  } from 'typeorm';
import { PostView } from '../entities/post-view.entity';
import { Post } from '../entities/posts.entity';
  
  @EventSubscriber()
  export class PostViewSubscriber implements EntitySubscriberInterface<PostView> {
    listenTo() {
      return PostView;
    }
  
    async afterInsert(event: InsertEvent<PostView>) {
      const postRepository = event.manager.getRepository(Post);
  
      await postRepository.increment({ id: event.entity.post.id }, 'views', 1);
    }
  }