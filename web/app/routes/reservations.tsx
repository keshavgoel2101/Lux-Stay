import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { reservationsApi, type Reservation, type PaginatedResponse } from "~/lib/api";
import { useAuth } from "~/lib/auth";
import { useCurrency } from "~/lib/currency";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { 
  Loader2, 
  Calendar, 
  MapPin, 
  Users,
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
  Bed
} from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, "default" | "secondary" | "destructive" | "success" | "warning"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "destructive",
  COMPLETED: "secondary",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

export default function Reservations() {
  const navigate = useNavigate();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const { formatPrice } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Cancel dialog state
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Filter state
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login?redirect=/reservations");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const fetchReservations = async () => {
    if (!token) return;
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      params.set("page", searchParams.get("page") || "1");
      params.set("limit", "10");
      params.set("sortBy", "createdAt");
      params.set("sortOrder", "desc");
      if (statusFilter) params.set("status", statusFilter);

      const response = await reservationsApi.getAll(token, params);
      setReservations(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reservations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReservations();
    }
  }, [searchParams, token]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (value) params.set("status", value);
    else params.delete("status");
    setSearchParams(params);
  };

  const handleCancelReservation = async () => {
    if (!cancelId || !token) return;
    setIsCancelling(true);

    try {
      await reservationsApi.cancel(token, cancelId);
      setCancelId(null);
      fetchReservations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel reservation");
    } finally {
      setIsCancelling(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Reservations</h1>
          <p className="text-muted-foreground">
            View and manage your hotel bookings
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <Select value={statusFilter || "ALL"} onValueChange={(value) => handleStatusFilterChange(value === "ALL" ? "" : value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          {pagination.total} reservations
        </p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" onClick={fetchReservations} className="mt-4">
            Try Again
          </Button>
        </div>
      )}

      {/* Reservations list */}
      {!isLoading && !error && (
        <>
          {reservations.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reservations found</h3>
              <p className="text-muted-foreground mb-4">
                Start exploring hotels and book your first stay!
              </p>
              <Button onClick={() => navigate("/hotels")}>
                Browse Hotels
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <Card key={reservation.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {reservation.room?.name || "Room"}
                        </CardTitle>
                        {reservation.room?.hotel && (
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {reservation.room.hotel.name} - {reservation.room.hotel.city}
                          </div>
                        )}
                      </div>
                      <Badge variant={statusColors[reservation.status]}>
                        {statusLabels[reservation.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">Check-in</div>
                          <div className="text-sm font-medium">
                            {format(new Date(reservation.checkInDate), "MMM dd, yyyy")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">Check-out</div>
                          <div className="text-sm font-medium">
                            {format(new Date(reservation.checkOutDate), "MMM dd, yyyy")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">Guests</div>
                          <div className="text-sm font-medium">{reservation.guestCount}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">Total</div>
                          <div className="text-sm font-medium">{formatPrice(reservation.totalPrice)}</div>
                        </div>
                      </div>
                    </div>
                    {reservation.specialRequests && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-md">
                        <div className="text-xs text-muted-foreground mb-1">Special Requests</div>
                        <p className="text-sm">{reservation.specialRequests}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Booked on {format(new Date(reservation.createdAt), "MMM dd, yyyy")}
                    </div>
                    {(reservation.status === "PENDING" || reservation.status === "CONFIRMED") && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setCancelId(reservation.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Cancel confirmation dialog */}
      <Dialog open={!!cancelId} onOpenChange={(open) => !open && setCancelId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Reservation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this reservation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelId(null)}>
              Keep Reservation
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelReservation}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Reservation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function meta() {
  return [
    { title: "My Reservations - LuxStay" },
    { name: "description", content: "View and manage your hotel reservations" },
  ];
}
