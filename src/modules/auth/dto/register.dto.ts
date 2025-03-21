import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsStrongPassword, IsString, IsEnum, IsOptional } from "class-validator"
import { RegisterType } from "../../../modules/users/entities/user.entity"

export class RegisterDto {
    @ApiProperty({ type: String })
    @IsEmail()
    @IsOptional()
    email: string

    @ApiProperty({ type: String })
    @IsStrongPassword({
        minLowercase: 1, //소문
        minUppercase: 1, // 대문
        minLength: 8, //길이
        minSymbols: 1, //특문
    })

    @IsOptional()
    password?: string


    @ApiProperty({ type: String })
    @IsString()
    name: string

    @IsEnum(RegisterType)
    registerType: RegisterType = RegisterType.COMMON

    @IsString()
    @IsOptional()
    socialId?: string

}
