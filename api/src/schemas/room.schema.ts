import { z } from "zod";

const roomTypeEnum = z.enum(["SINGLE", "DOUBLE", "TWIN", "SUITE", "DELUXE", "PENTHOUSE"]);

export const createRoomSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Room name is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    roomType: roomTypeEnum,
    pricePerNight: z.number().positive("Price must be positive"),
    capacity: z.number().int().positive("Capacity must be a positive integer"),
    images: z.array(z.string().url()).optional().default([]),
    amenities: z.array(z.string()).optional().default([]),
    isAvailable: z.boolean().optional().default(true),
    hotelId: z.string().uuid("Invalid hotel ID"),
  }),
});

export const updateRoomSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid room ID"),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(10).optional(),
    roomType: roomTypeEnum.optional(),
    pricePerNight: z.number().positive().optional(),
    capacity: z.number().int().positive().optional(),
    images: z.array(z.string().url()).optional(),
    amenities: z.array(z.string()).optional(),
    isAvailable: z.boolean().optional(),
  }),
});

export const roomQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.enum(["name", "pricePerNight", "capacity", "createdAt", "roomType"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    search: z.string().optional(),
    hotelId: z.string().uuid().optional(),
    roomType: roomTypeEnum.optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    minCapacity: z.string().optional(),
    isAvailable: z.string().optional(),
  }),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>["body"];
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>["body"];
export type RoomQueryInput = z.infer<typeof roomQuerySchema>["query"];
