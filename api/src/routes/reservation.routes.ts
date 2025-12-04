import { Router, Response } from "express";
import { prisma } from "../config/database.js";
import { validate } from "../middleware/validate.js";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth.js";
import {
  createReservationSchema,
  updateReservationSchema,
  reservationQuerySchema,
  CreateReservationInput,
  UpdateReservationInput,
  ReservationQueryInput,
} from "../schemas/reservation.schema.js";
import {
  getPaginationParams,
  createPaginatedResponse,
} from "../utils/pagination.js";
import { Prisma } from "../generated/prisma/client.js";

const router = Router();

// Get all reservations for current user (clients see their reservations)
router.get(
  "/",
  authenticate,
  validate(reservationQuerySchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const query = req.query as ReservationQueryInput;
      const { page, limit, skip, sortOrder } = getPaginationParams(query);
      const sortBy = query.sortBy || "createdAt";

      // Build where clause
      const where: Prisma.ReservationWhereInput = {
        userId: req.user!.id,
      };

      // Filter by status
      if (query.status) {
        where.status = query.status;
      }

      // Filter by date range
      if (query.fromDate) {
        where.checkInDate = { gte: new Date(query.fromDate) };
      }

      if (query.toDate) {
        where.checkOutDate = { lte: new Date(query.toDate) };
      }

      const [reservations, total] = await Promise.all([
        prisma.reservation.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            room: {
              include: {
                hotel: {
                  select: {
                    id: true,
                    name: true,
                    city: true,
                    country: true,
                    images: true,
                  },
                },
              },
            },
          },
        }),
        prisma.reservation.count({ where }),
      ]);

      const response = createPaginatedResponse(reservations, total, page, limit);
      res.json(response);
    } catch (error) {
      console.error("Get reservations error:", error);
      res.status(500).json({ error: "Failed to fetch reservations" });
    }
  }
);

// Get reservations for hotel owner (see all reservations for their hotels)
router.get(
  "/hotel-owner",
  authenticate,
  requireRole("HOTEL_OWNER", "ADMIN"),
  validate(reservationQuerySchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const query = req.query as ReservationQueryInput;
      const { page, limit, skip, sortOrder } = getPaginationParams(query);
      const sortBy = query.sortBy || "createdAt";

      // Get hotels owned by user
      const ownedHotels = await prisma.hotel.findMany({
        where: { ownerId: req.user!.id },
        select: { id: true },
      });

      const hotelIds = ownedHotels.map((h) => h.id);

      // Build where clause
      const where: Prisma.ReservationWhereInput = {
        room: {
          hotelId: { in: hotelIds },
        },
      };

      // Filter by hotel if specified
      if (query.hotelId && hotelIds.includes(query.hotelId)) {
        where.room = { hotelId: query.hotelId };
      }

      // Filter by room
      if (query.roomId) {
        where.roomId = query.roomId;
      }

      // Filter by status
      if (query.status) {
        where.status = query.status;
      }

      // Filter by date range
      if (query.fromDate) {
        where.checkInDate = { gte: new Date(query.fromDate) };
      }

      if (query.toDate) {
        where.checkOutDate = { lte: new Date(query.toDate) };
      }

      const [reservations, total] = await Promise.all([
        prisma.reservation.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            room: {
              include: {
                hotel: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        }),
        prisma.reservation.count({ where }),
      ]);

      const response = createPaginatedResponse(reservations, total, page, limit);
      res.json(response);
    } catch (error) {
      console.error("Get hotel reservations error:", error);
      res.status(500).json({ error: "Failed to fetch reservations" });
    }
  }
);

// Get single reservation
router.get(
  "/:id",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const reservation = await prisma.reservation.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          room: {
            include: {
              hotel: true,
            },
          },
        },
      });

      if (!reservation) {
        res.status(404).json({ error: "Reservation not found" });
        return;
      }

      // Check authorization - user owns reservation or owns the hotel
      const isOwner = reservation.userId === req.user!.id;
      const isHotelOwner = reservation.room.hotel.ownerId === req.user!.id;
      const isAdmin = req.user!.role === "ADMIN";

      if (!isOwner && !isHotelOwner && !isAdmin) {
        res.status(403).json({ error: "Not authorized to view this reservation" });
        return;
      }

      res.json({ reservation });
    } catch (error) {
      console.error("Get reservation error:", error);
      res.status(500).json({ error: "Failed to fetch reservation" });
    }
  }
);

// Create reservation (clients only)
router.post(
  "/",
  authenticate,
  validate(createReservationSchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const data = req.body as CreateReservationInput;

      // Check if room exists and is available
      const room = await prisma.room.findUnique({
        where: { id: data.roomId },
      });

      if (!room) {
        res.status(404).json({ error: "Room not found" });
        return;
      }

      if (!room.isAvailable) {
        res.status(400).json({ error: "Room is not available" });
        return;
      }

      // Check guest count doesn't exceed capacity
      if (data.guestCount > room.capacity) {
        res.status(400).json({ 
          error: `Guest count exceeds room capacity of ${room.capacity}` 
        });
        return;
      }

      const checkInDate = new Date(data.checkInDate);
      const checkOutDate = new Date(data.checkOutDate);

      // Validate dates
      if (checkInDate >= checkOutDate) {
        res.status(400).json({ error: "Check-out date must be after check-in date" });
        return;
      }

      if (checkInDate < new Date()) {
        res.status(400).json({ error: "Check-in date cannot be in the past" });
        return;
      }

      // Check for conflicting reservations
      const conflictingReservations = await prisma.reservation.findMany({
        where: {
          roomId: data.roomId,
          status: { in: ["PENDING", "CONFIRMED"] },
          OR: [
            {
              AND: [
                { checkInDate: { lte: checkInDate } },
                { checkOutDate: { gt: checkInDate } },
              ],
            },
            {
              AND: [
                { checkInDate: { lt: checkOutDate } },
                { checkOutDate: { gte: checkOutDate } },
              ],
            },
            {
              AND: [
                { checkInDate: { gte: checkInDate } },
                { checkOutDate: { lte: checkOutDate } },
              ],
            },
          ],
        },
      });

      if (conflictingReservations.length > 0) {
        res.status(400).json({ error: "Room is already booked for the selected dates" });
        return;
      }

      // Calculate total price
      const nights = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const totalPrice = nights * room.pricePerNight;

      const reservation = await prisma.reservation.create({
        data: {
          roomId: data.roomId,
          userId: req.user!.id,
          checkInDate,
          checkOutDate,
          guestCount: data.guestCount,
          totalPrice,
          specialRequests: data.specialRequests,
          status: "PENDING",
        },
        include: {
          room: {
            include: {
              hotel: {
                select: {
                  id: true,
                  name: true,
                  city: true,
                  country: true,
                },
              },
            },
          },
        },
      });

      res.status(201).json({
        message: "Reservation created successfully",
        reservation,
      });
    } catch (error) {
      console.error("Create reservation error:", error);
      res.status(500).json({ error: "Failed to create reservation" });
    }
  }
);

// Update reservation (owner or hotel owner)
router.patch(
  "/:id",
  authenticate,
  validate(updateReservationSchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data = req.body as UpdateReservationInput;

      const existingReservation = await prisma.reservation.findUnique({
        where: { id },
        include: {
          room: {
            include: {
              hotel: true,
            },
          },
        },
      });

      if (!existingReservation) {
        res.status(404).json({ error: "Reservation not found" });
        return;
      }

      // Check authorization
      const isOwner = existingReservation.userId === req.user!.id;
      const isHotelOwner = existingReservation.room.hotel.ownerId === req.user!.id;
      const isAdmin = req.user!.role === "ADMIN";

      if (!isOwner && !isHotelOwner && !isAdmin) {
        res.status(403).json({ error: "Not authorized to update this reservation" });
        return;
      }

      // Only hotel owners can change status to CONFIRMED or COMPLETED
      if (data.status && ["CONFIRMED", "COMPLETED"].includes(data.status) && !isHotelOwner && !isAdmin) {
        res.status(403).json({ error: "Only hotel owners can confirm or complete reservations" });
        return;
      }

      // Recalculate price if dates changed
      let totalPrice = existingReservation.totalPrice;
      if (data.checkInDate || data.checkOutDate) {
        const checkInDate = data.checkInDate 
          ? new Date(data.checkInDate) 
          : existingReservation.checkInDate;
        const checkOutDate = data.checkOutDate 
          ? new Date(data.checkOutDate) 
          : existingReservation.checkOutDate;

        const nights = Math.ceil(
          (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        totalPrice = nights * existingReservation.room.pricePerNight;
      }

      const reservation = await prisma.reservation.update({
        where: { id },
        data: {
          ...data,
          ...(data.checkInDate && { checkInDate: new Date(data.checkInDate) }),
          ...(data.checkOutDate && { checkOutDate: new Date(data.checkOutDate) }),
          totalPrice,
        },
        include: {
          room: {
            include: {
              hotel: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      res.json({
        message: "Reservation updated successfully",
        reservation,
      });
    } catch (error) {
      console.error("Update reservation error:", error);
      res.status(500).json({ error: "Failed to update reservation" });
    }
  }
);

// Cancel reservation (owner only, or hotel owner)
router.delete(
  "/:id",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const existingReservation = await prisma.reservation.findUnique({
        where: { id },
        include: {
          room: {
            include: {
              hotel: true,
            },
          },
        },
      });

      if (!existingReservation) {
        res.status(404).json({ error: "Reservation not found" });
        return;
      }

      // Check authorization
      const isOwner = existingReservation.userId === req.user!.id;
      const isHotelOwner = existingReservation.room.hotel.ownerId === req.user!.id;
      const isAdmin = req.user!.role === "ADMIN";

      if (!isOwner && !isHotelOwner && !isAdmin) {
        res.status(403).json({ error: "Not authorized to cancel this reservation" });
        return;
      }

      // Update status to cancelled instead of deleting
      await prisma.reservation.update({
        where: { id },
        data: { status: "CANCELLED" },
      });

      res.json({ message: "Reservation cancelled successfully" });
    } catch (error) {
      console.error("Cancel reservation error:", error);
      res.status(500).json({ error: "Failed to cancel reservation" });
    }
  }
);

export default router;
