import { Router, Request, Response } from "express";
import { prisma } from "../config/database.js";
import { validate } from "../middleware/validate.js";
import { authenticate, requireRole, optionalAuth, AuthRequest } from "../middleware/auth.js";
import {
  createRoomSchema,
  updateRoomSchema,
  roomQuerySchema,
  CreateRoomInput,
  UpdateRoomInput,
  RoomQueryInput,
} from "../schemas/room.schema.js";
import {
  getPaginationParams,
  createPaginatedResponse,
} from "../utils/pagination.js";
import { Prisma } from "../generated/prisma/client.js";

const router = Router();

// Get all rooms (public, with pagination, search, filter, sort)
router.get(
  "/",
  validate(roomQuerySchema),
  optionalAuth,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const query = req.query as RoomQueryInput;
      const { page, limit, skip, sortOrder } = getPaginationParams(query);
      const sortBy = query.sortBy || "createdAt";

      // Build where clause for filtering
      const where: Prisma.RoomWhereInput = {};

      // Search by room name, description, or hotel city/country/name
      if (query.search) {
        where.OR = [
          { name: { contains: query.search, mode: "insensitive" } },
          { description: { contains: query.search, mode: "insensitive" } },
          { hotel: { name: { contains: query.search, mode: "insensitive" } } },
          { hotel: { city: { contains: query.search, mode: "insensitive" } } },
          { hotel: { country: { contains: query.search, mode: "insensitive" } } },
        ];
      }

      // Filter by hotel
      if (query.hotelId) {
        where.hotelId = query.hotelId;
      }

      // Filter by room type
      if (query.roomType) {
        where.roomType = query.roomType;
      }

      // Filter by price range
      if (query.minPrice || query.maxPrice) {
        where.pricePerNight = {};
        if (query.minPrice) {
          where.pricePerNight.gte = parseFloat(query.minPrice);
        }
        if (query.maxPrice) {
          where.pricePerNight.lte = parseFloat(query.maxPrice);
        }
      }

      // Filter by minimum capacity
      if (query.minCapacity) {
        where.capacity = { gte: parseInt(query.minCapacity) };
      }

      // Filter by availability
      if (query.isAvailable !== undefined) {
        where.isAvailable = query.isAvailable === "true";
      }

      // Get rooms with pagination
      const [rooms, total] = await Promise.all([
        prisma.room.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            hotel: {
              select: {
                id: true,
                name: true,
                city: true,
                country: true,
                rating: true,
              },
            },
          },
        }),
        prisma.room.count({ where }),
      ]);

      const response = createPaginatedResponse(rooms, total, page, limit);
      res.json(response);
    } catch (error) {
      console.error("Get rooms error:", error);
      res.status(500).json({ error: "Failed to fetch rooms" });
    }
  }
);

// Get single room by ID (public)
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        hotel: {
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!room) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    res.json({ room });
  } catch (error) {
    console.error("Get room error:", error);
    res.status(500).json({ error: "Failed to fetch room" });
  }
});

// Create room (hotel owners only, for their hotels)
router.post(
  "/",
  authenticate,
  requireRole("HOTEL_OWNER", "ADMIN"),
  validate(createRoomSchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const data = req.body as CreateRoomInput;

      // Check if hotel exists and belongs to user
      const hotel = await prisma.hotel.findUnique({
        where: { id: data.hotelId },
      });

      if (!hotel) {
        res.status(404).json({ error: "Hotel not found" });
        return;
      }

      if (hotel.ownerId !== req.user!.id && req.user!.role !== "ADMIN") {
        res.status(403).json({ error: "Not authorized to add rooms to this hotel" });
        return;
      }

      const room = await prisma.room.create({
        data,
        include: {
          hotel: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.status(201).json({
        message: "Room created successfully",
        room,
      });
    } catch (error) {
      console.error("Create room error:", error);
      res.status(500).json({ error: "Failed to create room" });
    }
  }
);

// Update room (owner only)
router.patch(
  "/:id",
  authenticate,
  requireRole("HOTEL_OWNER", "ADMIN"),
  validate(updateRoomSchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data = req.body as UpdateRoomInput;

      // Check if room exists and hotel belongs to user
      const existingRoom = await prisma.room.findUnique({
        where: { id },
        include: {
          hotel: true,
        },
      });

      if (!existingRoom) {
        res.status(404).json({ error: "Room not found" });
        return;
      }

      if (existingRoom.hotel.ownerId !== req.user!.id && req.user!.role !== "ADMIN") {
        res.status(403).json({ error: "Not authorized to update this room" });
        return;
      }

      const room = await prisma.room.update({
        where: { id },
        data,
        include: {
          hotel: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.json({
        message: "Room updated successfully",
        room,
      });
    } catch (error) {
      console.error("Update room error:", error);
      res.status(500).json({ error: "Failed to update room" });
    }
  }
);

// Delete room (owner only)
router.delete(
  "/:id",
  authenticate,
  requireRole("HOTEL_OWNER", "ADMIN"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Check if room exists and hotel belongs to user
      const existingRoom = await prisma.room.findUnique({
        where: { id },
        include: {
          hotel: true,
        },
      });

      if (!existingRoom) {
        res.status(404).json({ error: "Room not found" });
        return;
      }

      if (existingRoom.hotel.ownerId !== req.user!.id && req.user!.role !== "ADMIN") {
        res.status(403).json({ error: "Not authorized to delete this room" });
        return;
      }

      await prisma.room.delete({
        where: { id },
      });

      res.json({ message: "Room deleted successfully" });
    } catch (error) {
      console.error("Delete room error:", error);
      res.status(500).json({ error: "Failed to delete room" });
    }
  }
);

// Get rooms by hotel (for hotel owners to manage their rooms)
router.get(
  "/hotel/:hotelId",
  optionalAuth,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { hotelId } = req.params;
      const query = req.query as RoomQueryInput;
      const { page, limit, skip, sortOrder } = getPaginationParams(query);
      const sortBy = query.sortBy || "createdAt";

      const where: Prisma.RoomWhereInput = { hotelId };

      if (query.search) {
        where.AND = [
          { hotelId },
          {
            OR: [
              { name: { contains: query.search, mode: "insensitive" } },
              { description: { contains: query.search, mode: "insensitive" } },
            ],
          },
        ];
      }

      if (query.roomType) {
        where.roomType = query.roomType;
      }

      if (query.isAvailable !== undefined) {
        where.isAvailable = query.isAvailable === "true";
      }

      const [rooms, total] = await Promise.all([
        prisma.room.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        prisma.room.count({ where }),
      ]);

      const response = createPaginatedResponse(rooms, total, page, limit);
      res.json(response);
    } catch (error) {
      console.error("Get hotel rooms error:", error);
      res.status(500).json({ error: "Failed to fetch rooms" });
    }
  }
);

// Check room availability for date range
router.get(
  "/:id/availability",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { checkIn, checkOut } = req.query;

      if (!checkIn || !checkOut) {
        res.status(400).json({ error: "checkIn and checkOut dates are required" });
        return;
      }

      const room = await prisma.room.findUnique({
        where: { id },
      });

      if (!room) {
        res.status(404).json({ error: "Room not found" });
        return;
      }

      if (!room.isAvailable) {
        res.json({ available: false, reason: "Room is not available" });
        return;
      }

      // Check for conflicting reservations
      const conflictingReservations = await prisma.reservation.findMany({
        where: {
          roomId: id,
          status: { in: ["PENDING", "CONFIRMED"] },
          OR: [
            {
              AND: [
                { checkInDate: { lte: new Date(checkIn as string) } },
                { checkOutDate: { gt: new Date(checkIn as string) } },
              ],
            },
            {
              AND: [
                { checkInDate: { lt: new Date(checkOut as string) } },
                { checkOutDate: { gte: new Date(checkOut as string) } },
              ],
            },
            {
              AND: [
                { checkInDate: { gte: new Date(checkIn as string) } },
                { checkOutDate: { lte: new Date(checkOut as string) } },
              ],
            },
          ],
        },
      });

      res.json({
        available: conflictingReservations.length === 0,
        conflictingReservations: conflictingReservations.length,
      });
    } catch (error) {
      console.error("Check availability error:", error);
      res.status(500).json({ error: "Failed to check availability" });
    }
  }
);

export default router;
