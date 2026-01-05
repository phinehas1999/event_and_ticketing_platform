import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as users from "./schema/users";
import * as events from "./schema/events";
import * as tickets from "./schema/tickets";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle(pool, { 
  schema: { ...users, ...events, ...tickets } 
});