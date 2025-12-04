import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authApi, type User } from "./api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role?: "CLIENT" | "HOTEL_OWNER"
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isHotelOwner: boolean;
  isClient: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token in localStorage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      // Verify token and get user
      authApi
        .me(storedToken)
        .then(({ user }) => {
          setUser(user);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    setUser(response.user);
    setToken(response.token);
    localStorage.setItem("token", response.token);
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role?: "CLIENT" | "HOTEL_OWNER"
  ) => {
    const response = await authApi.register({
      email,
      password,
      firstName,
      lastName,
      role,
    });
    setUser(response.user);
    setToken(response.token);
    localStorage.setItem("token", response.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isHotelOwner: user?.role === "HOTEL_OWNER" || user?.role === "ADMIN",
        isClient: user?.role === "CLIENT",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
