import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUsuarioDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
