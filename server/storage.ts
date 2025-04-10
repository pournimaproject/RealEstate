import { users, properties, inquiries, favorites, 
         type User, type InsertUser, 
         type Property, type InsertProperty,
         type Inquiry, type InsertInquiry,
         type Favorite, type InsertFavorite } from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db, pool } from "./db";
import { eq, and, gte, lte, desc, like, sql } from "drizzle-orm";

const PostgresStore = connectPg(session);

// modify the interface with CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  
  // Property methods
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<Property>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  getAllProperties(filters?: PropertyFilters): Promise<Property[]>;
  getPropertiesByUser(userId: number): Promise<Property[]>;
  getFeaturedProperties(limit?: number): Promise<Property[]>;
  
  // Inquiry methods
  getInquiry(id: number): Promise<Inquiry | undefined>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiry(id: number, inquiry: Partial<Inquiry>): Promise<Inquiry | undefined>;
  deleteInquiry(id: number): Promise<boolean>;
  getInquiriesByProperty(propertyId: number): Promise<Inquiry[]>;
  getInquiriesByUser(userId: number): Promise<Inquiry[]>;
  
  // Favorite methods
  getFavorite(id: number): Promise<Favorite | undefined>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  deleteFavorite(id: number): Promise<boolean>;
  getFavoritesByUser(userId: number): Promise<Favorite[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export type PropertyFilters = {
  location?: string;
  propertyType?: string;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  areaMin?: number;
  areaMax?: number;
  status?: string;
};

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return !!result;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Property methods
  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const now = new Date();
    const [property] = await db
      .insert(properties)
      .values({
        ...insertProperty,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return property;
  }

  async updateProperty(id: number, updateData: Partial<Property>): Promise<Property | undefined> {
    const [updatedProperty] = await db
      .update(properties)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(properties.id, id))
      .returning();
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    const result = await db.delete(properties).where(eq(properties.id, id));
    return !!result;
  }

  async getAllProperties(filters?: PropertyFilters): Promise<Property[]> {
    let query = db.select().from(properties);
    
    if (filters) {
      const conditions = [];
      
      if (filters.location) {
        conditions.push(
          sql`(LOWER(${properties.city}) LIKE ${`%${filters.location.toLowerCase()}%`} OR LOWER(${properties.state}) LIKE ${`%${filters.location.toLowerCase()}%`})`
        );
      }
      
      if (filters.propertyType) {
        conditions.push(eq(properties.propertyType, filters.propertyType));
      }
      
      if (filters.priceMin !== undefined) {
        conditions.push(gte(properties.price, filters.priceMin));
      }
      
      if (filters.priceMax !== undefined) {
        conditions.push(lte(properties.price, filters.priceMax));
      }
      
      if (filters.bedrooms !== undefined) {
        conditions.push(gte(properties.bedrooms, filters.bedrooms));
      }
      
      if (filters.bathrooms !== undefined) {
        conditions.push(gte(properties.bathrooms, filters.bathrooms));
      }
      
      if (filters.areaMin !== undefined) {
        conditions.push(gte(properties.area, filters.areaMin));
      }
      
      if (filters.areaMax !== undefined) {
        conditions.push(lte(properties.area, filters.areaMax));
      }
      
      if (filters.status) {
        conditions.push(eq(properties.status, filters.status));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
    }
    
    return await query;
  }

  async getPropertiesByUser(userId: number): Promise<Property[]> {
    return await db
      .select()
      .from(properties)
      .where(eq(properties.userId, userId));
  }

  async getFeaturedProperties(limit: number = 6): Promise<Property[]> {
    return await db
      .select()
      .from(properties)
      .orderBy(desc(properties.createdAt))
      .limit(limit);
  }

  // Inquiry methods
  async getInquiry(id: number): Promise<Inquiry | undefined> {
    const [inquiry] = await db.select().from(inquiries).where(eq(inquiries.id, id));
    return inquiry;
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const [inquiry] = await db
      .insert(inquiries)
      .values({
        ...insertInquiry,
        status: "pending",
      })
      .returning();
    return inquiry;
  }

  async updateInquiry(id: number, updateData: Partial<Inquiry>): Promise<Inquiry | undefined> {
    const [updatedInquiry] = await db
      .update(inquiries)
      .set(updateData)
      .where(eq(inquiries.id, id))
      .returning();
    return updatedInquiry;
  }

  async deleteInquiry(id: number): Promise<boolean> {
    const result = await db.delete(inquiries).where(eq(inquiries.id, id));
    return !!result;
  }

  async getInquiriesByProperty(propertyId: number): Promise<Inquiry[]> {
    return await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.propertyId, propertyId));
  }

  async getInquiriesByUser(userId: number): Promise<Inquiry[]> {
    return await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.userId, userId));
  }

  // Favorite methods
  async getFavorite(id: number): Promise<Favorite | undefined> {
    const [favorite] = await db.select().from(favorites).where(eq(favorites.id, id));
    return favorite;
  }

  async createFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const [favorite] = await db
      .insert(favorites)
      .values(insertFavorite)
      .returning();
    return favorite;
  }

  async deleteFavorite(id: number): Promise<boolean> {
    const result = await db.delete(favorites).where(eq(favorites.id, id));
    return !!result;
  }

  async getFavoritesByUser(userId: number): Promise<Favorite[]> {
    return await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, userId));
  }
}

export const storage = new DatabaseStorage();
