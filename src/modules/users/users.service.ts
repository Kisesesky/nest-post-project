import { UnauthorizedException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from './../auth/dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async createUser(registerDto: RegisterDto) {
        const user = this.userRepository.create(registerDto)
        await this.userRepository.save(user)

        const { password, ...rest } = user
        return rest
    }

    async findUserByEmail(email: string):Promise<User> {
        const user = await this.userRepository.findOne({ where: { email }})
        if(!user)
            throw new UnauthorizedException('이메일 또는 패스워드가 잘 못 되었습니다.')
        return user
    }
}
