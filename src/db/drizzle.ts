import { drizzle } from "drizzle-orm/node-postgres";
import { CONFIG } from "src/config/configuration";

const db = drizzle(CONFIG.DATABASE_URL);

export default db;
