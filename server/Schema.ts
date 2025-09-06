import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const contacts = pgTable("contacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const admins = pgTable("admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull()
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
