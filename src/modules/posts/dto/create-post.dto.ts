import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class CreatePostDto {
    @ApiProperty({ type: String })
    @IsString()
    title: string

    @ApiProperty({ type: String })
    @IsString()
    content: string

    @ApiProperty({ type: String })
    @IsString()
    thumbnailUrl: string

}