import { NestFactory } from "@nestjs/core";
import { drizzle } from "drizzle-orm/node-postgres";

import { AppModule } from "./app.module";
import { CONFIG } from "./config/configuration";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  drizzle(CONFIG.DATABASE_URL);

  await app.listen(process.env.PORT ?? 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
