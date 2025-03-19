import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsStrongPassword, IsString } from "class-validator"

export class RegisterDto {
    @ApiProperty({ type: String })
    @IsEmail()
    email: string

    @ApiProperty({ type: String })
    @IsStrongPassword({
        minLowercase: 1, //소문
        minUppercase: 1, // 대문
        minLength: 8, //길이
        minSymbols: 1, //특문
    })
    password: string


    @ApiProperty({ type: String })
    @IsString()
    name: string

}
