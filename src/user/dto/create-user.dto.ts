import { IsString, IsInt, Min, MaxLength, Max, isString  } from "class-validator";

export class CreateUserDto {
    @IsString()
    @MaxLength(100)
    name: string;

    @IsInt()
    @Min(18)
    age: number;

    @IsString()
    @MaxLength(100)
    password : string;
}