import { pgTable, text, serial, integer, boolean, timestamp, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  role: text("role").notNull().default("buyer"), // buyer, seller, admin, agent
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  role: true,
  avatar: true
});

// Property Schema
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  country: text("country").notNull(),
  propertyType: text("property_type").notNull(), // house, apartment, condo, villa
  status: text("status").notNull().default("for_sale"), // for_sale, for_rent, sold, rented
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  area: integer("area").notNull(), // in square feet
  yearBuilt: integer("year_built"),
  images: json("images").default([]),
  features: json("features").default([]), // array of features like "garage", "swimming pool", etc.
  userId: integer("user_id").notNull(), // Owner/Agent
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertPropertySchema = createInsertSchema(properties).pick({
  title: true,
  description: true,
  price: true,
  address: true,
  city: true,
  state: true,
  zipCode: true,
  country: true,
  propertyType: true,
  status: true,
  bedrooms: true,
  bathrooms: true,
  area: true,
  yearBuilt: true,
  images: true,
  features: true,
  userId: true
});

// Contact Inquiries Schema
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  propertyId: integer("property_id"),
  userId: integer("user_id"), // If the user is logged in
  createdAt: timestamp("created_at").defaultNow(),
  status: text("status").default("pending") // pending, responded, closed
});

export const insertInquirySchema = createInsertSchema(inquiries).pick({
  name: true,
  email: true,
  phone: true,
  message: true,
  propertyId: true,
  userId: true
});

// Favorites Schema
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  propertyId: integer("property_id").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertFavoriteSchema = createInsertSchema(favorites).pick({
  userId: true,
  propertyId: true
});

// Define Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;
