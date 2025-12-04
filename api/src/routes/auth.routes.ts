import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database.js";
import { env } from "../config/env.js";
import { validate } from "../middleware/validate.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import { registerSchema, loginSchema, RegisterInput, LoginInput } from "../schemas/auth.schema.js";

const router = Router();

// Register new user
router.post(
  "/register",
  validate(registerSchema),
  async (req: Request<{}, {}, RegisterInput>, res: Response): Promise<void> => {
    try {
      const { email, password, firstName, lastName, role } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        res.status(400).json({ error: "User with this email already exists" });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: role || "GUEST",
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
      });

      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(201).json({
        message: "User registered successfully",
        user,
        token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  }
);

// Login
router.post(
  "/login",
  validate(loginSchema),
  async (req: Request<{}, {}, LoginInput>, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  }
);

// Get current user
router.get(
  "/me",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              hotels: true,
              reservations: true,
            },
          },
        },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({ user });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  }
);

// Update current user
router.patch(
  "/me",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { firstName, lastName } = req.body;

      const user = await prisma.user.update({
        where: { id: req.user!.id },
        data: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
      });

      res.json({ user });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  }
);

export default router;
