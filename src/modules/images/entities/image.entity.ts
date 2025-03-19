import { BaseEntity } from "../../../common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Image extends BaseEntity {
    @Column()
    imageUrl: string

    @Column()
    filePath: string
}