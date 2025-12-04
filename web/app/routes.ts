import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("hotels", "routes/hotels.tsx"),
  route("hotels/:id", "routes/hotel-detail.tsx"),
  route("rooms", "routes/rooms.tsx"),
  route("rooms/:id", "routes/room-detail.tsx"),
  route("reservations", "routes/reservations.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("dashboard/hotels/new", "routes/dashboard-hotel-new.tsx"),
  route("dashboard/hotels/:id/edit", "routes/dashboard-hotel-edit.tsx"),
  route("dashboard/hotels/:id/rooms", "routes/dashboard-hotel-rooms.tsx"),
  route("dashboard/hotels/:id/rooms/new", "routes/dashboard-room-new.tsx"),
  route("dashboard/hotels/:id/rooms/:roomId/edit", "routes/dashboard-room-edit.tsx"),
  route("profile", "routes/profile.tsx"),
] satisfies RouteConfig;
