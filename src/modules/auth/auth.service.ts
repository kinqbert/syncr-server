import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { TokenPayload } from "src/common/types/token";
import { generateAccessToken, generateRefreshToken } from "src/common/utils/jwt";
import db from "src/db/drizzle";
import { refreshTokens, users } from "src/db/schema";

import { LoginDto, RegisterDto } from "./auth.dto";

@Injectable()
export class AuthService {
  private readonly SALT_ROUNS = 10;

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const emailDuplicateUsersAmount = await db.$count(users, eq(users.email, email));

    if (emailDuplicateUsersAmount > 0) {
      throw new ConflictException("User with such email already exists.");
    }

    const hashedPassword = await this.hashPassword(password);

    await db.insert(users).values({ email, password: hashedPassword });
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const error = new NotFoundException("Wrong email or password.");

    const [existingUser] = await db
      .select({ id: users.id, password: users.password })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!existingUser) {
      throw error;
    }

    const isPasswordMatch = await this.comparePassword(password, existingUser.password);

    if (!isPasswordMatch) {
      throw error;
    }

    const { accessToken } = await this.refreshTokensForUser(existingUser.id);

    return { accessToken };
  }

  private async refreshTokensForUser(userId: number) {
    await this.removeUserRefreshTokens(userId);

    const payload: TokenPayload = { userId };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await this.addRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  private async addRefreshToken(userId: number, refreshToken: string) {
    await db.insert(refreshTokens).values({ token: refreshToken, userId });
  }

  private async removeUserRefreshTokens(userId: number) {
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, this.SALT_ROUNS);
  }

  private async comparePassword(inputPassword: string, hashedPassword: string) {
    return bcrypt.compare(inputPassword, hashedPassword);
  }
}
