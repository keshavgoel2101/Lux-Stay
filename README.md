# 🏨 LuxStay — Luxury Hotel Booking Platform

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Runtime](https://img.shields.io/badge/runtime-Bun-000000?logo=bun)
![Frontend](https://img.shields.io/badge/frontend-React_Router_7-CA4245?logo=reactrouter)
![Backend](https://img.shields.io/badge/backend-Express.js_5-000000?logo=express)
![Database](https://img.shields.io/badge/database-PostgreSQL-4169E1?logo=postgresql)
![ORM](https://img.shields.io/badge/ORM-Prisma_7-2D3748?logo=prisma)
![Auth](https://img.shields.io/badge/auth-JWT-orange)
![Language](https://img.shields.io/badge/language-TypeScript-3178C6?logo=typescript)
![UI](https://img.shields.io/badge/UI-Tailwind_CSS-38B2AC?logo=tailwindcss)
![UI](https://img.shields.io/badge/UI-shadcn%2Fui-000000)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)
![License](https://img.shields.io/badge/license-MIT-blue)

LuxStay is a modern, full-stack hotel booking platform designed for travelers seeking luxury accommodations worldwide. Whether you're a guest searching for the perfect stay or a hotel owner managing your properties, LuxStay provides an intuitive, seamless experience. With role-based access control, real-time room availability checking, advanced search and filtering, and a beautiful responsive UI built with React Router 7 and Tailwind CSS, LuxStay makes discovering and booking luxury hotels effortless.

## Table of Contents

- [🏨 LuxStay — Luxury Hotel Booking Platform](#-luxstay--luxury-hotel-booking-platform)
  - [Table of Contents](#table-of-contents)
  - [📌 Live Services](#-live-services)
  - [📁 Repository Structure](#-repository-structure)
  - [🛠 Tech Stack](#-tech-stack)
    - [Languages \& Frameworks](#languages--frameworks)
    - [Libraries \& Tools](#libraries--tools)
  - [🧩 High-Level Architecture](#-high-level-architecture)
  - [🚀 Features](#-features)
    - [Authentication \& Authorization](#authentication--authorization)
    - [Hotel Management](#hotel-management)
    - [Room Management](#room-management)
    - [Reservation System](#reservation-system)
    - [User Experience](#user-experience)
    - [Developer Experience](#developer-experience)
  - [📡 API Endpoints](#-api-endpoints)
    - [Authentication Routes](#authentication-routes)
    - [Hotel Routes](#hotel-routes)
    - [Room Routes](#room-routes)
    - [Reservation Routes](#reservation-routes)
  - [⚙️ Installation (Local Development)](#️-installation-local-development)
    - [Prerequisites](#prerequisites)
    - [1) Clone and Install](#1-clone-and-install)
    - [2) Environment Variables](#2-environment-variables)
    - [3) Database Setup](#3-database-setup)
    - [4) Start Development](#4-start-development)
  - [🧪 Usage Guide](#-usage-guide)
    - [Web Application](#web-application)
    - [API Usage](#api-usage)
    - [Available Scripts](#available-scripts)
  - [👥 Authors](#-authors)

<a id="live-services"></a>

## 📌 Live Services

| Layer | Platform | Link                            |
| ----- | -------- | ------------------------------- |
| Web   | Vercel   | https://lux-stay-web.vercel.app |
| API   | Vercel   | https://lux-stay-api.vercel.app |

<a id="repository-structure"></a>

## 📁 Repository Structure

```
LuxStay/
├─ api/                           # Backend: Express + Prisma + Zod
│  ├─ src/
│  │  ├─ index.ts                 # Server bootstrap (CORS, routes, middleware)
│  │  ├─ config/
│  │  │  ├─ database.ts           # PrismaClient singleton & connection
│  │  │  └─ env.ts                # Environment configuration
│  │  ├─ generated/
│  │  │  └─ prisma/               # Prisma generated client
│  │  ├─ middleware/
│  │  │  ├─ auth.ts               # JWT authentication & role-based access
│  │  │  └─ validate.ts           # Zod request validation middleware
│  │  ├─ routes/
│  │  │  ├─ auth.routes.ts        # /api/auth - register, login, me, update
│  │  │  ├─ hotel.routes.ts       # /api/hotels - CRUD, search, filter
│  │  │  ├─ room.routes.ts        # /api/rooms - CRUD, availability check
│  │  │  └─ reservation.routes.ts # /api/reservations - booking management
│  │  ├─ schemas/                 # Zod validation schemas
│  │  │  ├─ auth.schema.ts
│  │  │  ├─ hotel.schema.ts
│  │  │  ├─ reservation.schema.ts
│  │  │  └─ room.schema.ts
│  │  └─ utils/
│  │     └─ pagination.ts         # Pagination helpers
│  ├─ prisma/
│  │  ├─ schema.prisma            # Database models: User, Hotel, Room, Reservation
│  │  ├─ seed.ts                  # Database seeding script
│  │  └─ migrations/              # Database migrations
│  └─ package.json
│
└─ web/                           # Frontend: React Router 7 + Vite + Tailwind
   ├─ app/
   │  ├─ root.tsx                 # App shell with providers (Auth, Currency)
   │  ├─ routes.ts                # Route definitions
   │  ├─ app.css                  # Global styles
   │  ├─ components/
   │  │  ├─ navbar.tsx            # Navigation with auth state
   │  │  ├─ footer.tsx            # Site footer
   │  │  ├─ image-carousel.tsx    # Image gallery component
   │  │  └─ ui/                   # shadcn/ui components
   │  │     ├─ avatar.tsx
   │  │     ├─ badge.tsx
   │  │     ├─ button.tsx
   │  │     ├─ card.tsx
   │  │     ├─ dialog.tsx
   │  │     ├─ dropdown-menu.tsx
   │  │     ├─ input.tsx
   │  │     ├─ label.tsx
   │  │     ├─ select.tsx
   │  │     ├─ separator.tsx
   │  │     ├─ tabs.tsx
   │  │     └─ textarea.tsx
   │  ├─ lib/
   │  │  ├─ api.ts                # API client with typed endpoints
   │  │  ├─ auth.tsx              # Auth context & hooks
   │  │  ├─ currency.tsx          # Currency context & formatting
   │  │  └─ utils.ts              # Utility functions
   │  └─ routes/
   │     ├─ home.tsx              # Landing page
   │     ├─ login.tsx             # Login page
   │     ├─ register.tsx          # Registration page
   │     ├─ hotels.tsx            # Hotel listing & search
   │     ├─ hotel-detail.tsx      # Hotel details with rooms
   │     ├─ rooms.tsx             # Room listing & search
   │     ├─ room-detail.tsx       # Room details & booking
   │     ├─ reservations.tsx      # User reservations
   │     ├─ profile.tsx           # User profile management
   │     ├─ dashboard.tsx         # Hotel owner dashboard
   │     ├─ dashboard-hotel-new.tsx
   │     ├─ dashboard-hotel-edit.tsx
   │     ├─ dashboard-hotel-rooms.tsx
   │     ├─ dashboard-room-new.tsx
   │     └─ dashboard-room-edit.tsx
   ├─ public/                     # Static assets
   └─ package.json
```

<a id="tech-stack"></a>

## 🛠 Tech Stack

### Languages & Frameworks

- **Frontend:** React 19, React Router 7, TypeScript, Vite 7
- **Backend:** Express.js 5, TypeScript, Bun runtime
- **Database:** PostgreSQL
- **ORM:** Prisma 7

### Libraries & Tools

- **UI:** Tailwind CSS 4, shadcn/ui, Radix UI (Avatar, Dialog, Dropdown Menu, Label, Popover, Select, Separator, Slot, Tabs, Toast), Lucide Icons
- **Date Handling:** date-fns, react-day-picker
- **Styling Utilities:** clsx, tailwind-merge, class-variance-authority
- **Authentication:** jsonwebtoken (JWT), bcryptjs
- **Validation:** Zod
- **HTTP:** cors, express
- **Database Adapter:** @prisma/adapter-pg, pg
- **Environment:** dotenv
- **Build Tools:** Vite, TypeScript, vite-tsconfig-paths
- **Deployment:** Vercel (web + api), Docker

<a id="high-level-architecture"></a>

## 🧩 High-Level Architecture

```
┌─────────────────────────┐          ┌───────────────────────────┐           ┌─────────────────┐
│   React Router 7        │  fetch   │   Express API (Bun)       │  Prisma   │   PostgreSQL    │
│   (Web Frontend)        ├─────────>│   /api/auth               ├──────────>│   (Users,       │
│                         │  Bearer  │   /api/hotels             │           │    Hotels,      │
│   Vite + Tailwind CSS   │  Token   │   /api/rooms              │           │    Rooms,       │
└─────────────────────────┘          │   /api/reservations       │           │    Reservations)│
                                     └───────────────────────────┘           └─────────────────┘
```

**Key Architecture Details:**

- **Authentication:** JWT tokens stored in localStorage, sent via `Authorization: Bearer` header
- **Role-Based Access:** Three user roles: `CLIENT`, `HOTEL_OWNER`, `ADMIN` with different permissions
- **CORS:** Configured for frontend origin with credentials support
- **Database Relations:**
  - User → Hotels (one-to-many, for hotel owners)
  - User → Reservations (one-to-many, for clients)
  - Hotel → Rooms (one-to-many, cascade delete)
  - Room → Reservations (one-to-many)
- **Pagination:** Server-side pagination with configurable page size, total counts, and navigation metadata
- **Validation:** Zod schemas for all request validation on API routes

<a id="features"></a>

## 🚀 Features

### Authentication & Authorization

- Email + password registration and login (bcrypt hashing)
- JWT-based session management with 7-day expiry
- Role-based access control (Client, Hotel Owner, Admin)
- Protected routes and API endpoints
- User profile management

### Hotel Management

- Create, Read, Update, Delete hotels (Hotel Owners/Admin only)
- Hotel details: name, description, address, city, country, rating
- Multiple images and amenities support
- Search by name, description, or city
- Filter by city, country, minimum rating
- Sort by various fields with pagination

### Room Management

- Create, Read, Update, Delete rooms within hotels
- Room types: Single, Double, Twin, Suite, Deluxe, Penthouse
- Pricing per night with capacity limits
- Multiple images and amenities per room
- Real-time availability checking
- Filter by hotel, room type, price range, capacity
- Availability status management

### Reservation System

- Create reservations with date selection
- Automatic price calculation based on nights
- Guest count validation against room capacity
- Conflict detection for overlapping bookings
- Reservation statuses: Pending, Confirmed, Cancelled, Completed
- Special requests support
- Hotel owners can view and manage all reservations for their properties
- Status updates (confirm/complete) by hotel owners only

### User Experience

- Responsive design with modern UI
- Featured destinations showcase
- Hotel and room image galleries
- Advanced search and filtering
- Pagination for large result sets
- Currency formatting support
- Clean navigation with auth state awareness

### Developer Experience

- TypeScript throughout (frontend and backend)
- Zod-validated API inputs
- Prisma for type-safe database queries
- Hot reload development with Bun
- Modular route and component structure
- Reusable UI components (shadcn/ui)

<a id="api-endpoints"></a>

## 📡 API Endpoints

Base URL (local): `http://localhost:3000/api`  
All authenticated routes require `Authorization: Bearer <token>` header.

### Authentication Routes

| Endpoint             | Method | Description                                 | Access        |
| -------------------- | ------ | ------------------------------------------- | ------------- |
| `/`                  | GET    | Health check                                | Public        |
| `/api/auth/register` | POST   | Register user (email, password, name, role) | Public        |
| `/api/auth/login`    | POST   | Login (email, password) → returns token     | Public        |
| `/api/auth/me`       | GET    | Get current user profile                    | Auth required |
| `/api/auth/me`       | PATCH  | Update current user (firstName, lastName)   | Auth required |

### Hotel Routes

| Endpoint                      | Method | Description                               | Access            |
| ----------------------------- | ------ | ----------------------------------------- | ----------------- |
| `/api/hotels`                 | GET    | Get all hotels (search, filter, paginate) | Public            |
| `/api/hotels/:id`             | GET    | Get single hotel with available rooms     | Public            |
| `/api/hotels/owner/my-hotels` | GET    | Get hotels owned by current user          | Hotel Owner/Admin |
| `/api/hotels`                 | POST   | Create new hotel                          | Hotel Owner/Admin |
| `/api/hotels/:id`             | PATCH  | Update hotel                              | Owner/Admin       |
| `/api/hotels/:id`             | DELETE | Delete hotel (cascades to rooms)          | Owner/Admin       |

### Room Routes

| Endpoint                      | Method | Description                              | Access            |
| ----------------------------- | ------ | ---------------------------------------- | ----------------- |
| `/api/rooms`                  | GET    | Get all rooms (search, filter, paginate) | Public            |
| `/api/rooms/:id`              | GET    | Get single room with hotel details       | Public            |
| `/api/rooms/hotel/:hotelId`   | GET    | Get rooms for specific hotel             | Public            |
| `/api/rooms/:id/availability` | GET    | Check room availability for dates        | Public            |
| `/api/rooms`                  | POST   | Create room for owned hotel              | Hotel Owner/Admin |
| `/api/rooms/:id`              | PATCH  | Update room                              | Owner/Admin       |
| `/api/rooms/:id`              | DELETE | Delete room                              | Owner/Admin       |

### Reservation Routes

| Endpoint                        | Method | Description                        | Access            |
| ------------------------------- | ------ | ---------------------------------- | ----------------- |
| `/api/reservations`             | GET    | Get current user's reservations    | Auth required     |
| `/api/reservations/hotel-owner` | GET    | Get reservations for owned hotels  | Hotel Owner/Admin |
| `/api/reservations/:id`         | GET    | Get single reservation             | Owner/Hotel Owner |
| `/api/reservations`             | POST   | Create new reservation             | Auth required     |
| `/api/reservations/:id`         | PATCH  | Update reservation (dates, status) | Owner/Hotel Owner |
| `/api/reservations/:id`         | DELETE | Cancel reservation                 | Owner/Hotel Owner |

<a id="installation-local-development"></a>

## ⚙️ Installation (Local Development)

<a id="prerequisites"></a>

### Prerequisites

- **Bun** >= 1.0 ([https://bun.sh](https://bun.sh))
- **Node.js** >= 18 (for some tooling)
- **PostgreSQL** (local or remote instance)

<a id="1-clone-and-install"></a>

### 1) Clone and Install

```bash
git clone https://github.com/keshavgoel2101/LuxStay.git
cd LuxStay

# Install API dependencies
cd api
bun install

# Install Web dependencies
cd ../web
bun install
```

<a id="2-environment-variables"></a>

### 2) Environment Variables

Create `.env` files in each project directory:

**api/.env**

```env
# Node environment
NODE_ENV=development

# Port to run API on
PORT=3000

# Frontend origin (for CORS)
FRONTEND_URL=http://localhost:5173

# PostgreSQL connection string
DATABASE_URL=postgresql://username:password@localhost:5432/luxstay

# JWT secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# JWT expiration
JWT_EXPIRES_IN=7d
```

**web/.env**

```env
# Backend API base URL
VITE_API_URL=http://localhost:3000/api
```

<a id="3-database-setup"></a>

### 3) Database Setup

Run from the API directory:

```bash
cd api

# Generate Prisma client
bun run db:generate

# Run migrations
bun run db:migrate

# (Optional) Seed the database
bun run db:seed

# (Optional) Open Prisma Studio to view data
bun run db:studio
```

<a id="4-start-development"></a>

### 4) Start Development

**Start API server:**

```bash
cd api
bun run dev
# API runs on http://localhost:3000
```

**Start Web app (in a new terminal):**

```bash
cd web
bun run dev
# Web app runs on http://localhost:5173
```

<a id="usage-guide"></a>

## 🧪 Usage Guide

<a id="web-application"></a>

### Web Application

1. Open [http://localhost:5173](http://localhost:5173)
2. Register a new account:
   - Choose **Client** role to browse and book hotels
   - Choose **Hotel Owner** role to manage properties
3. **As a Client:**
   - Browse hotels and rooms on the homepage
   - Use search and filters to find accommodations
   - View hotel and room details with image galleries
   - Make reservations with date selection
   - View and manage your reservations
4. **As a Hotel Owner:**
   - Access the Dashboard to manage your hotels
   - Create new hotels with details, images, and amenities
   - Add rooms to your hotels with pricing and availability
   - View and manage reservations for your properties
   - Confirm or complete reservations

<a id="api-usage"></a>

### API Usage

**Register a new user:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CLIENT"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Get hotels:**

```bash
curl http://localhost:3000/api/hotels?city=Paris&minRating=4
```

**Create a reservation (authenticated):**

```bash
curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "roomId": "room-uuid",
    "checkInDate": "2025-12-15",
    "checkOutDate": "2025-12-20",
    "guestCount": 2
  }'
```

<a id="available-scripts"></a>

### Available Scripts

**API (api/)**

| Command               | Description                      |
| --------------------- | -------------------------------- |
| `bun run dev`         | Start dev server with hot reload |
| `bun run build`       | Build TypeScript to dist         |
| `bun run start`       | Start production server          |
| `bun run db:generate` | Generate Prisma client           |
| `bun run db:push`     | Push schema changes to database  |
| `bun run db:migrate`  | Run database migrations          |
| `bun run db:studio`   | Open Prisma Studio               |
| `bun run db:seed`     | Seed the database                |

**Web (web/)**

| Command             | Description                  |
| ------------------- | ---------------------------- |
| `bun run dev`       | Start Vite dev server        |
| `bun run build`     | Build for production         |
| `bun run start`     | Start production server      |
| `bun run typecheck` | Run TypeScript type checking |

<a id="authors"></a>

## 👥 Authors

- **Keshav Goyal** — [https://github.com/keshavgoel2101](https://github.com/keshavgoel2101)
