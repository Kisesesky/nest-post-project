import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsInt, IsOptional, Min } from "class-validator"

export abstract class pagenationDto {
    @IsInt()
    @Type(()=> Number)
    @IsOptional()
    @Min(1)
    @ApiProperty({ required: false, default: 1 })
    page: number = 1

    @IsInt()
    @Type(()=> Number)
    @IsOptional()
    @Min(1)
    @ApiProperty({ required: false, default: 10 })
    limit: number = 10
}