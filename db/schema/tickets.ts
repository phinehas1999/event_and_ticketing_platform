import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { events } from "./events";
import { users } from "./users";

export const ticketTypes = pgTable("ticket_types", {
  id: uuid("id").defaultRandom().primaryKey(),

  eventId: uuid("event_id")
    .references(() => events.id)
    .notNull(),

  name: text("name").notNull(),
  price: integer("price").notNull(), // cents
  quantityTotal: integer("quantity_total").notNull(),
  quantitySold: integer("quantity_sold").default(0).notNull(),
});

export const ticketStatusEnum = pgEnum("ticket_status", [
  "VALID",
  "USED",
  "CANCELLED",
]);

export const tickets = pgTable("tickets", {
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

  status: ticketStatusEnum("status").default("VALID").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
