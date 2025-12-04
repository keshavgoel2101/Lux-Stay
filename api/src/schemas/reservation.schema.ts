import { z } from "zod";

const reservationStatusEnum = z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]);

export const createReservationSchema = z.object({
  body: z.object({
    roomId: z.string().uuid("Invalid room ID"),
    checkInDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    checkOutDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    guestCount: z.number().int().positive("Guest count must be positive"),
    specialRequests: z.string().optional(),
  }),
});

export const updateReservationSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid reservation ID"),
  }),
  body: z.object({
    status: reservationStatusEnum.optional(),
    checkInDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
    checkOutDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
    guestCount: z.number().int().positive().optional(),
    specialRequests: z.string().optional(),
  }),
});

export const reservationQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.enum(["checkInDate", "checkOutDate", "totalPrice", "createdAt", "status"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    status: reservationStatusEnum.optional(),
    roomId: z.string().uuid().optional(),
    hotelId: z.string().uuid().optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
  }),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>["body"];
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>["body"];
export type ReservationQueryInput = z.infer<typeof reservationQuerySchema>["query"];
