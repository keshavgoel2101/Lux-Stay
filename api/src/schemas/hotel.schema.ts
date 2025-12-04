import { z } from "zod";

export const createHotelSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Hotel name is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
    images: z.array(z.string().url()).optional().default([]),
    amenities: z.array(z.string()).optional().default([]),
  }),
});

export const updateHotelSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid hotel ID"),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(10).optional(),
    address: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    country: z.string().min(1).optional(),
    images: z.array(z.string().url()).optional(),
    amenities: z.array(z.string()).optional(),
  }),
});

export const hotelQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.enum(["name", "rating", "createdAt", "city"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    search: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    minRating: z.string().optional(),
  }),
});

export type CreateHotelInput = z.infer<typeof createHotelSchema>["body"];
export type UpdateHotelInput = z.infer<typeof updateHotelSchema>["body"];
export type HotelQueryInput = z.infer<typeof hotelQuerySchema>["query"];
