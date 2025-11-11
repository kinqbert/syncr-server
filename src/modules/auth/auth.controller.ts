import { Body, Controller, HttpCode, HttpStatus, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { COOKIE_PARAM } from "src/common/constants/cookie-param";
import { RefreshToken } from "src/common/decorators/refresh-token.decorator";
import { isProduction } from "src/common/utils/node-env";

import { LoginDto, RegisterDto } from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post("login")
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(loginDto);

    res.cookie(COOKIE_PARAM.accessToken, accessToken, {
      secure: isProduction(),
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60,
    });

    res.cookie(COOKIE_PARAM.refreshToken, refreshToken, {
      secure: isProduction(),
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @RefreshToken() refreshToken: string,
  ) {
    const { accessToken } = await this.authService.refreshAccessToken(refreshToken);

    res.cookie(COOKIE_PARAM.accessToken, accessToken, {
      secure: isProduction(),
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60,
    });
  }
}
