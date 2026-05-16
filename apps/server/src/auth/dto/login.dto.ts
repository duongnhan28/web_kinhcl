import { IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsString()
    readonly username: string;

    @IsString()
    @MinLength(8)
    readonly password: string;
}
