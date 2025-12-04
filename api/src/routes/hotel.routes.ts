import { Router, Request, Response } from "express";
import { prisma } from "../config/database.js";
import { validate } from "../middleware/validate.js";
import { authenticate, requireRole, optionalAuth, AuthRequest } from "../middleware/auth.js";
import {
  createHotelSchema,
  updateHotelSchema,
  hotelQuerySchema,
  CreateHotelInput,
  UpdateHotelInput,
  HotelQueryInput,
} from "../schemas/hotel.schema.js";
import {
  getPaginationParams,
  createPaginatedResponse,
} from "../utils/pagination.js";
import { Prisma } from "../generated/prisma/client.js";

const router = Router();

// Get all hotels (public, with pagination, search, filter, sort)
router.get(
  "/",
  validate(hotelQuerySchema),
  optionalAuth,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const query = req.query as HotelQueryInput;
      const { page, limit, skip, sortOrder } = getPaginationParams(query);
      const sortBy = query.sortBy || "createdAt";

      // Build where clause for filtering
      const where: Prisma.HotelWhereInput = {};

      // Search by name or description
      if (query.search) {
        where.OR = [
          { name: { contains: query.search, mode: "insensitive" } },
          { description: { contains: query.search, mode: "insensitive" } },
          { city: { contains: query.search, mode: "insensitive" } },
        ];
      }

      // Filter by city
      if (query.city) {
        where.city = { contains: query.city, mode: "insensitive" };
      }

      // Filter by country
      if (query.country) {
        where.country = { contains: query.country, mode: "insensitive" };
      }

      // Filter by minimum rating
      if (query.minRating) {
        where.rating = { gte: parseFloat(query.minRating) };
      }

      // Get hotels with pagination
      const [hotels, total] = await Promise.all([
        prisma.hotel.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            _count: {
              select: {
                rooms: true,
              },
            },
          },
        }),
        prisma.hotel.count({ where }),
      ]);

      const response = createPaginatedResponse(hotels, total, page, limit);
      res.json(response);
    } catch (error) {
      console.error("Get hotels error:", error);
      res.status(500).json({ error: "Failed to fetch hotels" });
    }
  }
);

// Get single hotel by ID (public)
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        rooms: {
          where: { isAvailable: true },
          orderBy: { pricePerNight: "asc" },
        },
      },
    });

    if (!hotel) {
      res.status(404).json({ error: "Hotel not found" });
      return;
    }

    res.json({ hotel });
  } catch (error) {
    console.error("Get hotel error:", error);
    res.status(500).json({ error: "Failed to fetch hotel" });
  }
});

// Create hotel (hotel owners only)
router.post(
  "/",
  authenticate,
  requireRole("HOTEL_OWNER", "ADMIN"),
  validate(createHotelSchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const data = req.body as CreateHotelInput;

      const hotel = await prisma.hotel.create({
        data: {
          ...data,
          ownerId: req.user!.id,
        },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      res.status(201).json({
        message: "Hotel created successfully",
        hotel,
      });
    } catch (error) {
      console.error("Create hotel error:", error);
      res.status(500).json({ error: "Failed to create hotel" });
    }
  }
);

// Update hotel (owner only)
router.patch(
  "/:id",
  authenticate,
  requireRole("HOTEL_OWNER", "ADMIN"),
  validate(updateHotelSchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data = req.body as UpdateHotelInput;

      // Check if hotel exists and belongs to user
      const existingHotel = await prisma.hotel.findUnique({
        where: { id },
      });

      if (!existingHotel) {
        res.status(404).json({ error: "Hotel not found" });
        return;
      }

      if (existingHotel.ownerId !== req.user!.id && req.user!.role !== "ADMIN") {
        res.status(403).json({ error: "Not authorized to update this hotel" });
        return;
      }

      const hotel = await prisma.hotel.update({
        where: { id },
        data,
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      res.json({
        message: "Hotel updated successfully",
        hotel,
      });
    } catch (error) {
      console.error("Update hotel error:", error);
      res.status(500).json({ error: "Failed to update hotel" });
    }
  }
);

// Delete hotel (owner only)
router.delete(
  "/:id",
  authenticate,
  requireRole("HOTEL_OWNER", "ADMIN"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Check if hotel exists and belongs to user
      const existingHotel = await prisma.hotel.findUnique({
        where: { id },
      });

      if (!existingHotel) {
        res.status(404).json({ error: "Hotel not found" });
        return;
      }

      if (existingHotel.ownerId !== req.user!.id && req.user!.role !== "ADMIN") {
        res.status(403).json({ error: "Not authorized to delete this hotel" });
        return;
      }

      await prisma.hotel.delete({
        where: { id },
      });

      res.json({ message: "Hotel deleted successfully" });
    } catch (error) {
      console.error("Delete hotel error:", error);
      res.status(500).json({ error: "Failed to delete hotel" });
    }
  }
);

// Get hotels owned by current user
router.get(
  "/owner/my-hotels",
  authenticate,
  requireRole("HOTEL_OWNER", "ADMIN"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const query = req.query as HotelQueryInput;
      const { page, limit, skip, sortOrder } = getPaginationParams(query);
      const sortBy = query.sortBy || "createdAt";

      const where: Prisma.HotelWhereInput = {
        ownerId: req.user!.id,
      };

      if (query.search) {
        where.AND = [
          { ownerId: req.user!.id },
          {
            OR: [
              { name: { contains: query.search, mode: "insensitive" } },
              { city: { contains: query.search, mode: "insensitive" } },
            ],
          },
        ];
      }

      const [hotels, total] = await Promise.all([
        prisma.hotel.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            _count: {
              select: {
                rooms: true,
                
              },
            },
          },
        }),
        prisma.hotel.count({ where }),
      ]);

      const response = createPaginatedResponse(hotels, total, page, limit);
      res.json(response);
    } catch (error) {
      console.error("Get my hotels error:", error);
      res.status(500).json({ error: "Failed to fetch hotels" });
    }
  }
);

export default router;
