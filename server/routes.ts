import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropertySchema, insertInquirySchema, insertFavoriteSchema } from "@shared/schema";
import { setupAuth } from "./auth";
import multer from "multer";
import path from "path";
import fs from "fs";

// Setup multer for file uploads
const storage_engine = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage_engine });

export async function registerRoutes(app: Express): Promise<Server> {
  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Property routes
  app.get("/api/properties", async (req, res) => {
    try {
      const filters = {
        location: req.query.location as string | undefined,
        propertyType: req.query.propertyType as string | undefined,
        priceMin: req.query.priceMin ? parseInt(req.query.priceMin as string) : undefined,
        priceMax: req.query.priceMax ? parseInt(req.query.priceMax as string) : undefined,
        bedrooms: req.query.bedrooms ? parseInt(req.query.bedrooms as string) : undefined,
        bathrooms: req.query.bathrooms ? parseInt(req.query.bathrooms as string) : undefined,
        areaMin: req.query.areaMin ? parseInt(req.query.areaMin as string) : undefined,
        areaMax: req.query.areaMax ? parseInt(req.query.areaMax as string) : undefined,
        status: req.query.status as string | undefined
      };
      const properties = await storage.getAllProperties(filters);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Error fetching properties", error });
    }
  });

  app.get("/api/properties/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const featuredProperties = await storage.getFeaturedProperties(limit);
      res.json(featuredProperties);
    } catch (error) {
      res.status(500).json({ message: "Error fetching featured properties", error });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const property = await storage.getProperty(propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Error fetching property", error });
    }
  });

  app.post("/api/properties", isAuthenticated, upload.array("images", 10), async (req, res) => {
    try {
      const userData = req.body;
      
      // Add image paths to the property data
      const images = (req.files as Express.Multer.File[])?.map(file => `/uploads/${file.filename}`) || [];
      
      // Parse features from string to array
      let features = [];
      if (req.body.features) {
        try {
          features = JSON.parse(req.body.features);
        } catch (e) {
          features = req.body.features.split(',').map((f: string) => f.trim());
        }
      }
      
      // Convert form fields to correct types
      const propertyData = {
        ...userData,
        price: parseInt(userData.price),
        bedrooms: parseInt(userData.bedrooms),
        bathrooms: parseInt(userData.bathrooms),
        area: parseInt(userData.area),
        yearBuilt: userData.yearBuilt ? parseInt(userData.yearBuilt) : undefined,
        userId: (req.user as any).id, // Get user ID from authenticated session
        images,
        features
      };
      
      // Validate data
      const validatedData = insertPropertySchema.parse(propertyData);
      
      // Create the property
      const property = await storage.createProperty(validatedData);
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ message: "Error creating property", error });
    }
  });

  app.put("/api/properties/:id", isAuthenticated, upload.array("images", 10), async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const property = await storage.getProperty(propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Check if user owns the property or is an admin
      const user = req.user as any;
      if (property.userId !== user.id && user.role !== 'admin' && user.role !== 'agent') {
        return res.status(403).json({ message: "Unauthorized to update this property" });
      }
      
      const userData = req.body;
      
      // Add new image paths
      let images = property.images as string[];
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const newImages = (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`);
        images = [...images, ...newImages];
      }
      
      // Parse features from string to array if provided
      let features = property.features;
      if (req.body.features) {
        try {
          features = JSON.parse(req.body.features);
        } catch (e) {
          features = req.body.features.split(',').map((f: string) => f.trim());
        }
      }
      
      // Convert form fields to correct types
      const propertyData = {
        ...userData,
        price: userData.price ? parseInt(userData.price) : property.price,
        bedrooms: userData.bedrooms ? parseInt(userData.bedrooms) : property.bedrooms,
        bathrooms: userData.bathrooms ? parseInt(userData.bathrooms) : property.bathrooms,
        area: userData.area ? parseInt(userData.area) : property.area,
        yearBuilt: userData.yearBuilt ? parseInt(userData.yearBuilt) : property.yearBuilt,
        images,
        features
      };
      
      // Update the property
      const updatedProperty = await storage.updateProperty(propertyId, propertyData);
      res.json(updatedProperty);
    } catch (error) {
      res.status(400).json({ message: "Error updating property", error });
    }
  });

  app.delete("/api/properties/:id", isAuthenticated, async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const property = await storage.getProperty(propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Check if user owns the property or is an admin
      const user = req.user as any;
      if (property.userId !== user.id && user.role !== 'admin' && user.role !== 'agent') {
        return res.status(403).json({ message: "Unauthorized to delete this property" });
      }
      
      await storage.deleteProperty(propertyId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting property", error });
    }
  });

  // User properties
  app.get("/api/user/properties", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const properties = await storage.getPropertiesByUser(userId);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user properties", error });
    }
  });

  // Inquiry routes
  app.post("/api/inquiries", async (req, res) => {
    try {
      const inquiryData = req.body;
      
      // Add user ID if authenticated
      if (req.isAuthenticated()) {
        inquiryData.userId = (req.user as any).id;
      }
      
      // Validate data
      const validatedData = insertInquirySchema.parse(inquiryData);
      
      // Create the inquiry
      const inquiry = await storage.createInquiry(validatedData);
      res.status(201).json(inquiry);
    } catch (error) {
      res.status(400).json({ message: "Error creating inquiry", error });
    }
  });

  app.get("/api/inquiries", isAuthenticated, isAuthorized(['admin', 'agent']), async (req, res) => {
    try {
      // If property ID is provided, get inquiries for that property
      if (req.query.propertyId) {
        const propertyId = parseInt(req.query.propertyId as string);
        const inquiries = await storage.getInquiriesByProperty(propertyId);
        return res.json(inquiries);
      }
      
      // If user ID is provided and user is admin, get inquiries for that user
      if (req.query.userId && (req.user as any).role === 'admin') {
        const userId = parseInt(req.query.userId as string);
        const inquiries = await storage.getInquiriesByUser(userId);
        return res.json(inquiries);
      }
      
      // Otherwise, get inquiries for the current user
      const userId = (req.user as any).id;
      const inquiries = await storage.getInquiriesByUser(userId);
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Error fetching inquiries", error });
    }
  });

  app.put("/api/inquiries/:id", isAuthenticated, isAuthorized(['admin', 'agent']), async (req, res) => {
    try {
      const inquiryId = parseInt(req.params.id);
      const inquiry = await storage.getInquiry(inquiryId);
      
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }
      
      const updatedInquiry = await storage.updateInquiry(inquiryId, req.body);
      res.json(updatedInquiry);
    } catch (error) {
      res.status(400).json({ message: "Error updating inquiry", error });
    }
  });

  // Favorite routes
  app.post("/api/favorites", isAuthenticated, async (req, res) => {
    try {
      const favoriteData = {
        ...req.body,
        userId: (req.user as any).id
      };
      
      // Validate data
      const validatedData = insertFavoriteSchema.parse(favoriteData);
      
      // Create the favorite
      const favorite = await storage.createFavorite(validatedData);
      res.status(201).json(favorite);
    } catch (error) {
      res.status(400).json({ message: "Error adding favorite", error });
    }
  });

  app.get("/api/favorites", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const favorites = await storage.getFavoritesByUser(userId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Error fetching favorites", error });
    }
  });

  app.delete("/api/favorites/:id", isAuthenticated, async (req, res) => {
    try {
      const favoriteId = parseInt(req.params.id);
      const favorite = await storage.getFavorite(favoriteId);
      
      if (!favorite) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      
      // Check if user owns the favorite
      if (favorite.userId !== (req.user as any).id) {
        return res.status(403).json({ message: "Unauthorized to remove this favorite" });
      }
      
      await storage.deleteFavorite(favoriteId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error removing favorite", error });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

// Middleware to check if user is authenticated
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized: Please log in" });
}

// Middleware to check if user has required roles
function isAuthorized(roles: string[]) {
  return (req: Request, res: Response, next: Function) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }
    
    const userRole = (req.user as any).role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
    
    next();
  };
}
