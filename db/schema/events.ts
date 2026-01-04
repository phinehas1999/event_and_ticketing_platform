import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { bankAccounts } from "./bankAccounts";

export const eventStatusEnum = pgEnum("event_status", [
  "DRAFT",
  "PENDING",
  "PUBLISHED",
  "CANCELLED",
]);

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),

  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),

  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location").notNull(),
  coverImageUrl: text("cover_image_url"),

  organizerId: uuid("organizer_id")
    .references(() => users.id)
    .notNull(),

  bankAccountId: uuid("bank_account_id")
    .references(() => bankAccounts.id)
    .notNull(),

  status: eventStatusEnum("status").default("DRAFT").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
