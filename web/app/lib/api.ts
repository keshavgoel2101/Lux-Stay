const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface FetchOptions extends RequestInit {
  token?: string | null;
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(customHeaders as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "An error occurred");
  }

  return data;
}

// Auth API
export const authApi = {
  register: (body: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: "CLIENT" | "HOTEL_OWNER";
  }) =>
    apiFetch<{
      message: string;
      user: User;
      token: string;
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    apiFetch<{
      message: string;
      user: User;
      token: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  me: (token: string) =>
    apiFetch<{ user: User }>("/auth/me", { token }),
};

// Hotels API
export const hotelsApi = {
  getAll: (params?: URLSearchParams, token?: string | null) =>
    apiFetch<PaginatedResponse<Hotel>>(
      `/hotels${params ? `?${params.toString()}` : ""}`,
      { token: token || undefined }
    ),

  getById: (id: string) =>
    apiFetch<{ hotel: HotelWithRooms }>(`/hotels/${id}`),

  getMyHotels: (token: string, params?: URLSearchParams) =>
    apiFetch<PaginatedResponse<Hotel>>(
      `/hotels/owner/my-hotels${params ? `?${params.toString()}` : ""}`,
      { token }
    ),

  create: (token: string, body: CreateHotelInput) =>
    apiFetch<{ message: string; hotel: Hotel }>("/hotels", {
      method: "POST",
      token,
      body: JSON.stringify(body),
    }),

  update: (token: string, id: string, body: Partial<CreateHotelInput>) =>
    apiFetch<{ message: string; hotel: Hotel }>(`/hotels/${id}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(body),
    }),

  delete: (token: string, id: string) =>
    apiFetch<{ message: string }>(`/hotels/${id}`, {
      method: "DELETE",
      token,
    }),
};

// Rooms API
export const roomsApi = {
  getAll: (params?: URLSearchParams, token?: string | null) =>
    apiFetch<PaginatedResponse<Room>>(
      `/rooms${params ? `?${params.toString()}` : ""}`,
      { token: token || undefined }
    ),

  getById: (id: string) =>
    apiFetch<{ room: RoomWithHotel }>(`/rooms/${id}`),

  getByHotel: (hotelId: string, params?: URLSearchParams) =>
    apiFetch<PaginatedResponse<Room>>(
      `/rooms/hotel/${hotelId}${params ? `?${params.toString()}` : ""}`
    ),

  checkAvailability: (id: string, checkIn: string, checkOut: string) =>
    apiFetch<{ available: boolean; reason?: string }>( 
      `/rooms/${id}/availability?checkIn=${checkIn}&checkOut=${checkOut}`
    ),

  create: (token: string, body: CreateRoomInput) =>
    apiFetch<{ message: string; room: Room }>("/rooms", {
      method: "POST",
      token,
      body: JSON.stringify(body),
    }),

  update: (token: string, id: string, body: Partial<CreateRoomInput>) =>
    apiFetch<{ message: string; room: Room }>(`/rooms/${id}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(body),
    }),

  delete: (token: string, id: string) =>
    apiFetch<{ message: string }>(`/rooms/${id}`, {
      method: "DELETE",
      token,
    }),
};

// Reservations API
export const reservationsApi = {
  getAll: (token: string, params?: URLSearchParams) =>
    apiFetch<PaginatedResponse<Reservation>>(
      `/reservations${params ? `?${params.toString()}` : ""}`,
      { token }
    ),

  getHotelOwnerReservations: (token: string, params?: URLSearchParams) =>
    apiFetch<PaginatedResponse<ReservationWithDetails>>(
      `/reservations/hotel-owner${params ? `?${params.toString()}` : ""}`,
      { token }
    ),

  getById: (token: string, id: string) =>
    apiFetch<{ reservation: ReservationWithDetails }>(`/reservations/${id}`, {
      token,
    }),

  create: (token: string, body: CreateReservationInput) =>
    apiFetch<{ message: string; reservation: Reservation }>("/reservations", {
      method: "POST",
      token,
      body: JSON.stringify(body),
    }),

  update: (
    token: string,
    id: string,
    body: Partial<CreateReservationInput> & { status?: string }
  ) =>
    apiFetch<{ message: string; reservation: Reservation }>(
      `/reservations/${id}`,
      {
        method: "PATCH",
        token,
        body: JSON.stringify(body),
      }
    ),

  cancel: (token: string, id: string) =>
    apiFetch<{ message: string }>(`/reservations/${id}`, {
      method: "DELETE",
      token,
    }),
};

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string; // computed from firstName + lastName
  role: "CLIENT" | "HOTEL_OWNER" | "ADMIN";
  createdAt?: string;
  _count?: {
    hotels: number;
    reservations: number;
  };
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  rating: number;
  images: string[];
  amenities: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  _count?: {
    rooms: number;
  };
}

export interface HotelWithRooms extends Hotel {
  rooms: Room[];
}

export interface Room {
  id: string;
  name: string;
  description: string;
  roomType: "SINGLE" | "DOUBLE" | "TWIN" | "SUITE" | "DELUXE" | "PENTHOUSE";
  pricePerNight: number;
  capacity: number;
  images: string[];
  amenities: string[];
  isAvailable: boolean;
  hotelId: string;
  createdAt: string;
  updatedAt: string;
  hotel?: {
    id: string;
    name: string;
    city: string;
    country: string;
    rating: number;
  };
}

export interface RoomWithHotel extends Room {
  hotel: Hotel & {
    owner: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
}

export interface Reservation {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  guestCount: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  specialRequests?: string;
  userId: string;
  roomId: string;
  createdAt: string;
  updatedAt: string;
  room?: Room & {
    hotel?: {
      id: string;
      name: string;
      city: string;
      country: string;
      images: string[];
    };
  };
}

export interface ReservationWithDetails {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  guestCount: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  specialRequests?: string;
  userId: string;
  roomId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  room: Room & {
    hotel: {
      id: string;
      name: string;
    };
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateHotelInput {
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  images?: string[];
  amenities?: string[];
}

export interface CreateRoomInput {
  name: string;
  description: string;
  roomType: "SINGLE" | "DOUBLE" | "TWIN" | "SUITE" | "DELUXE" | "PENTHOUSE";
  pricePerNight: number;
  capacity: number;
  hotelId: string;
  images?: string[];
  amenities?: string[];
  isAvailable?: boolean;
}

export interface CreateReservationInput {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  specialRequests?: string;
}
