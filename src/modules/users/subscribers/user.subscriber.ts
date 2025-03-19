import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { User } from './../entities/user.entity';
import { encryptPassword } from "../../../utils/password-util";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    listenTo() {
        return User
    }

    // async afterInsert(event: InsertEvent<User>) {
    //     if(event.entity.password) {
    //         const hashedPassword = await encryptPassword(event.entity.password)
    //         event.entity.password = hashedPassword
    //         await event.manager.save(event.entity)
    //     }
    // }
    async beforInsert(event: InsertEvent<User>) {
        if(event.entity.password) {
            event.entity.password = await encryptPassword(event.entity.password)
        }
    }
}