import { Link, useNavigate } from "react-router";
import { useAuth } from "~/lib/auth";
import { useCurrency, currencies } from "~/lib/currency";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Hotel, User, LogOut, Calendar, LayoutDashboard, Menu, X, Plus, Globe } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { user, logout, isAuthenticated, isHotelOwner } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Hotel className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            LuxStay
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/hotels"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse Hotels
          </Link>
          <Link
            to="/rooms"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Find Rooms
          </Link>
          {isHotelOwner && (
            <Link
              to="/dashboard/hotels/new"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              List Property
            </Link>
          )}
        </div>

        {/* Auth Section */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Currency Selector */}
          <Select
            value={currency.code}
            onValueChange={(value) => {
              const found = currencies.find((c) => c.code === value);
              if (found) setCurrency(found);
            }}
          >
            <SelectTrigger className="w-[100px] h-9">
              <Globe className="h-4 w-4 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.symbol} {c.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user && getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isHotelOwner && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/hotels/new" className="cursor-pointer">
                        <Plus className="mr-2 h-4 w-4" />
                        List Property
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/reservations" className="cursor-pointer">
                    <Calendar className="mr-2 h-4 w-4" />
                    My Reservations
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background p-4">
          <div className="flex flex-col space-y-4">
            {/* Mobile Currency Selector */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Currency</span>
              <Select
                value={currency.code}
                onValueChange={(value) => {
                  const found = currencies.find((c) => c.code === value);
                  if (found) setCurrency(found);
                }}
              >
                <SelectTrigger className="w-[120px] h-9">
                  <Globe className="h-4 w-4 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.symbol} {c.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="border-t pt-4">
            <Link
              to="/hotels"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Hotels
            </Link>
            </div>
            <Link
              to="/rooms"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Rooms
            </Link>
            {isAuthenticated ? (
              <>
                {isHotelOwner && (
                  <>
                    <Link
                      to="/dashboard/hotels/new"
                      className="text-sm font-medium text-primary hover:text-primary/80"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      List Property
                    </Link>
                    <Link
                      to="/dashboard"
                      className="text-sm font-medium text-muted-foreground hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </>
                )}
                <Link
                  to="/reservations"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Reservations
                </Link>
                <Button variant="destructive" onClick={handleLogout} className="w-full">
                  Log out
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    Log in
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    Sign up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
