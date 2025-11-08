import { Body, Controller, HttpCode, Post } from "@nestjs/common";

import { LoginDto, RegisterDto } from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(201)
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post("login")
  @HttpCode(201)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
