import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from './../users/entities/user.entity';
import { ListAllPostDto, OrderByOption, OrderOption } from './dto/list-all-post.dto';
import { PostView } from './entities/post-view.entity';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
        
        @InjectRepository(PostView)
        private postViewRepository: Repository<PostView>
        ) {}

    async createPost(createPostDto: CreatePostDto, user: User) {
        const post = this.postRepository.create({ ...createPostDto, user })
        return await this.postRepository.save(post)
    }

    async findAll(options: ListAllPostDto) {
      // const whereCondition:FindOptionsWhere<Post>[] = []
      // if(options.title){
      //   whereCondition.push({ title: ILike(`%${options.title}%`) })
      // }
      // if(options.content){
      //   whereCondition.push({ content: ILike(`&${options.content}&`)})
      // }
      // const { limit, page } = options
        // const [data, total] = await this.postRepository.findAndCount({
        //   relations: ['user'],
        //   where: whereCondition.length? whereCondition : {},
        //   take: options.limit,
        //   skip: options.limit * (options.page -1),
          // select: {
          //   user: {
          //     id: true,
          //     name: true,
          //   }
          // }
        const quertBuilder = this.postRepository
          .createQueryBuilder('p')
          .take(options.limit)
          .skip(options.limit * (options.page -1))
          // .orderBy('p.createdAt', 'DESC')
          .innerJoin('p.user', 'u')
          .select([
            'p.id',
            'p.title',
            'p.createdAt',
            'p.thumbnailUrl',
            'p.views',
            'u.id',
            'u.name'
          ])
          if(options.title) {
            quertBuilder.andWhere('p.title LIKE :title', { title: `%${options.title}%` })
          }

          if(options.content) {
            quertBuilder.andWhere('p.content LIKE :content', { content: `%${options.content}%` })
          }

          if(options.orderBy && [OrderByOption.VIEWS, OrderByOption.CREATED_AT].includes(options.orderBy)) {
            quertBuilder.orderBy(`p.${options.orderBy}`, options.order)
          }

          const [ data, total ] = await quertBuilder.getManyAndCount()
        
        return {
          data,
          total,
          page: +options.page,
          limit: +options.limit,
          totalPages: Math.ceil(total/options.limit)
        }
    }
    async findPostById(id:string) {
      return await this.postRepository.findOne({ where: {id} })
    }

    async findOne(id: string, user: User) {
        const data = await this.postRepository.findOne({ where: {id} })
        if(data) {
          const checkPostView = await this.postViewRepository.findOne({ 
            where: {user: {id: user.id}, post: {id: data.id}}, 
            order: { createdAt: OrderOption.DESC } 
          })
          
          if(checkPostView) {
            if(Date.now() - checkPostView.createdAt.getTime() <= 60 * 10 * 1000) {
              return {
                data
              }
            }
          }
          
          const postView = this.postViewRepository.create({
            post: data,
            user
          })
          await this.postViewRepository.save(postView)
          // const postViewCount = await this.postViewRepository.count({
          //   where: { post: { id: data.id } }
          // })
          // data.views = postViewCount
          // data.views++
          // await this.postRepository.save(data)
        }
        return data
    }
    
    async updatePost(postId: string, updatePostDto: UpdatePostDto) {
        const post = await this.postRepository.update(postId, {
          content: updatePostDto.content
        })
        if(!post) {
          throw new NotFoundException('해당하는 게시글이 없습니다.')
        }
        return post
      }
    
    async removePost(postId: string) {
        const post = await this.postRepository.findOne({ where: { id: postId}, relations: ['comments'] })
        if(!post) {
          throw new NotFoundException('해당하는 게시글이 없습니다.')
        }
        return await this.postRepository.remove(post)
      }

}
