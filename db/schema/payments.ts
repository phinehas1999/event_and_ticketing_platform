import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { events } from "./events";
import { ticketTypes } from "./tickets";

export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),

  eventId: uuid("event_id")
    .references(() => events.id)
    .notNull(),

  ticketTypeId: uuid("ticket_type_id")
    .references(() => ticketTypes.id)
    .notNull(),

  amount: integer("amount").notNull(),
  currency: text("currency").default("ETB").notNull(),

  paymentMethod: text("payment_method").default("BANK_TRANSFER"),
  receiptImageUrl: text("receipt_image_url").notNull(),

  status: paymentStatusEnum("status").default("PENDING").notNull(),

  reviewedBy: uuid("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
