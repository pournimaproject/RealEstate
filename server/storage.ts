import { users, properties, inquiries, favorites, 
         type User, type InsertUser, 
         type Property, type InsertProperty,
         type Inquiry, type InsertInquiry,
         type Favorite, type InsertFavorite } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private inquiries: Map<number, Inquiry>;
  private favorites: Map<number, Favorite>;
  sessionStore: session.SessionStore;
  currentUserId: number;
  currentPropertyId: number;
  currentInquiryId: number;
  currentFavoriteId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.inquiries = new Map();
    this.favorites = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    this.currentUserId = 1;
    this.currentPropertyId = 1;
    this.currentInquiryId = 1;
    this.currentFavoriteId = 1;
    
    // Add sample admin user
    this.createUser({
      username: "admin",
      password: "$2b$10$NrM4SuLCJ1D6QS0XdoGFT.TW4KYI0QBU39qJNaNPGWAFko6.WMvnS", // hashed "admin123"
      email: "admin@homeverse.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Property methods
  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.currentPropertyId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const property: Property = { ...insertProperty, id, createdAt, updatedAt };
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(id: number, updateData: Partial<Property>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const updatedProperty = { 
      ...property, 
      ...updateData,
      updatedAt: new Date()
    };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    return this.properties.delete(id);
  }

  async getAllProperties(filters?: PropertyFilters): Promise<Property[]> {
    let properties = Array.from(this.properties.values());
    
    if (filters) {
      if (filters.location) {
        properties = properties.filter(property => 
          property.city.toLowerCase().includes(filters.location!.toLowerCase()) || 
          property.state.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      
      if (filters.propertyType) {
        properties = properties.filter(property => 
          property.propertyType === filters.propertyType
        );
      }
      
      if (filters.priceMin !== undefined) {
        properties = properties.filter(property => 
          property.price >= filters.priceMin!
        );
      }
      
      if (filters.priceMax !== undefined) {
        properties = properties.filter(property => 
          property.price <= filters.priceMax!
        );
      }
      
      if (filters.bedrooms !== undefined) {
        properties = properties.filter(property => 
          property.bedrooms >= filters.bedrooms!
        );
      }
      
      if (filters.bathrooms !== undefined) {
        properties = properties.filter(property => 
          property.bathrooms >= filters.bathrooms!
        );
      }
      
      if (filters.areaMin !== undefined) {
        properties = properties.filter(property => 
          property.area >= filters.areaMin!
        );
      }
      
      if (filters.areaMax !== undefined) {
        properties = properties.filter(property => 
          property.area <= filters.areaMax!
        );
      }
      
      if (filters.status) {
        properties = properties.filter(property => 
          property.status === filters.status
        );
      }
    }
    
    return properties;
  }

  async getPropertiesByUser(userId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      property => property.userId === userId
    );
  }

  async getFeaturedProperties(limit: number = 6): Promise<Property[]> {
    return Array.from(this.properties.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  // Inquiry methods
  async getInquiry(id: number): Promise<Inquiry | undefined> {
    return this.inquiries.get(id);
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentInquiryId++;
    const createdAt = new Date();
    const inquiry: Inquiry = { ...insertInquiry, id, createdAt, status: "pending" };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  async updateInquiry(id: number, updateData: Partial<Inquiry>): Promise<Inquiry | undefined> {
    const inquiry = this.inquiries.get(id);
    if (!inquiry) return undefined;
    
    const updatedInquiry = { ...inquiry, ...updateData };
    this.inquiries.set(id, updatedInquiry);
    return updatedInquiry;
  }

  async deleteInquiry(id: number): Promise<boolean> {
    return this.inquiries.delete(id);
  }

  async getInquiriesByProperty(propertyId: number): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values()).filter(
      inquiry => inquiry.propertyId === propertyId
    );
  }

  async getInquiriesByUser(userId: number): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values()).filter(
      inquiry => inquiry.userId === userId
    );
  }

  // Favorite methods
  async getFavorite(id: number): Promise<Favorite | undefined> {
    return this.favorites.get(id);
  }

  async createFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = this.currentFavoriteId++;
    const createdAt = new Date();
    const favorite: Favorite = { ...insertFavorite, id, createdAt };
    this.favorites.set(id, favorite);
    return favorite;
  }

  async deleteFavorite(id: number): Promise<boolean> {
    return this.favorites.delete(id);
  }

  async getFavoritesByUser(userId: number): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(
      favorite => favorite.userId === userId
    );
  }
}

export const storage = new MemStorage();
