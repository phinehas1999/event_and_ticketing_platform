import {
  pgTable,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const bankAccounts = pgTable("bank_accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizerId: uuid("organizer_id")
    .references(() => users.id)
    .notNull(),

  bankName: text("bank_name").notNull(),
  accountNumber: text("account_number").notNull(),
  accountHolder: text("account_holder").notNull(),
  instructions: text("instructions"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
