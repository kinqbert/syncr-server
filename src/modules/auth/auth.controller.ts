import { Body, Controller, HttpCode, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { COOKIE_PARAM } from "src/common/constants/cookie-param";
import { isProduction } from "src/common/utils/node-env";

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
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken } = await this.authService.login(loginDto);

    res.cookie(COOKIE_PARAM.accessToken, accessToken, {
      secure: isProduction(),
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60,
    });
  }
}
