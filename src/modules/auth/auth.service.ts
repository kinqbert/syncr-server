import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import db from "src/db/drizzle";
import { users } from "src/db/schema";

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

    const [foundUser] = await db
      .select({ id: users.id, password: users.password })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!foundUser) {
      throw new NotFoundException("Wrong email or password.");
    }

    const isPasswordMatch = await this.comparePassword(password, foundUser.password);

    console.log(isPasswordMatch);
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, this.SALT_ROUNS);
  }

  private async comparePassword(inputPassword: string, hashedPassword: string) {
    return bcrypt.compare(inputPassword, hashedPassword);
  }
}
