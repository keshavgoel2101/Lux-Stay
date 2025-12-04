import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { hotelsApi, reservationsApi, type Hotel, type ReservationWithDetails } from "~/lib/api";
import { useAuth } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
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
  Plus,
  Building2,
  Bed,
  Calendar,
  MapPin,
  Star,
  Pencil,
  Trash2,
  Users,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock
} from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, "default" | "secondary" | "destructive" | "success" | "warning"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "destructive",
  COMPLETED: "secondary",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { token, isAuthenticated, isHotelOwner, isLoading: authLoading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Hotels state
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [hotelsPagination, setHotelsPagination] = useState({
    page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false,
  });
  const [hotelsLoading, setHotelsLoading] = useState(true);

  // Reservations state
  const [reservations, setReservations] = useState<ReservationWithDetails[]>([]);
  const [reservationsPagination, setReservationsPagination] = useState({
    page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false,
  });
  const [reservationsLoading, setReservationsLoading] = useState(true);
  const [reservationStatusFilter, setReservationStatusFilter] = useState("");

  // Delete dialog
  const [deleteHotelId, setDeleteHotelId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update reservation dialog
  const [updateReservation, setUpdateReservation] = useState<ReservationWithDetails | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const activeTab = searchParams.get("tab") || "hotels";

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isHotelOwner)) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, isHotelOwner, navigate]);

  const fetchHotels = async () => {
    if (!token) return;
    setHotelsLoading(true);

    try {
      const params = new URLSearchParams();
      params.set("page", searchParams.get("hotelPage") || "1");
      params.set("limit", "10");

      const response = await hotelsApi.getMyHotels(token, params);
      setHotels(response.data);
      setHotelsPagination(response.pagination);
    } catch (err) {
      console.error("Failed to fetch hotels:", err);
    } finally {
      setHotelsLoading(false);
    }
  };

  const fetchReservations = async () => {
    if (!token) return;
    setReservationsLoading(true);

    try {
      const params = new URLSearchParams();
      params.set("page", searchParams.get("reservationPage") || "1");
      params.set("limit", "10");
      params.set("sortBy", "createdAt");
      params.set("sortOrder", "desc");
      if (reservationStatusFilter) params.set("status", reservationStatusFilter);

      const response = await reservationsApi.getHotelOwnerReservations(token, params);
      setReservations(response.data);
      setReservationsPagination(response.pagination);
    } catch (err) {
      console.error("Failed to fetch reservations:", err);
    } finally {
      setReservationsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchHotels();
      fetchReservations();
    }
  }, [token, searchParams, reservationStatusFilter]);

  const handleDeleteHotel = async () => {
    if (!deleteHotelId || !token) return;
    setIsDeleting(true);

    try {
      await hotelsApi.delete(token, deleteHotelId);
      setDeleteHotelId(null);
      fetchHotels();
    } catch (err) {
      console.error("Failed to delete hotel:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateReservationStatus = async () => {
    if (!updateReservation || !newStatus || !token) return;
    setIsUpdating(true);

    try {
      await reservationsApi.update(token, updateReservation.id, { status: newStatus });
      setUpdateReservation(null);
      setNewStatus("");
      fetchReservations();
    } catch (err) {
      console.error("Failed to update reservation:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    setSearchParams(params);
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
          <h1 className="text-3xl font-bold mb-2">Hotel Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your hotels, rooms, and reservations
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/hotels/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Hotel
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="hotels" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            My Hotels ({hotelsPagination.total})
          </TabsTrigger>
          <TabsTrigger value="reservations" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Reservations ({reservationsPagination.total})
          </TabsTrigger>
        </TabsList>

        {/* Hotels Tab */}
        <TabsContent value="hotels">
          {hotelsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : hotels.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hotels yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first hotel
              </p>
              <Button asChild>
                <Link to="/dashboard/hotels/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Hotel
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-6">
                {hotels.map((hotel) => (
                  <Card key={hotel.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            {hotel.images && hotel.images.length > 0 ? (
                              <img
                                src={hotel.images[0]}
                                alt={hotel.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                                <Building2 className="h-8 w-8 text-primary/50" />
                              </div>
                            )}
                          </div>
                          <div>
                            <CardTitle>{hotel.name}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              {hotel.city}, {hotel.country}
                            </CardDescription>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge variant="secondary">
                                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                                {hotel.rating.toFixed(1)}
                              </Badge>
                              <Badge variant="outline">
                                <Bed className="h-3 w-3 mr-1" />
                                {hotel._count?.rooms || 0} rooms
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/dashboard/hotels/${hotel.id}/rooms/new`}>
                              <Plus className="h-4 w-4 mr-1" />
                              Add Room
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/dashboard/hotels/${hotel.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setDeleteHotelId(hotel.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {hotelsPagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set("hotelPage", (hotelsPagination.page - 1).toString());
                      setSearchParams(params);
                    }}
                    disabled={!hotelsPagination.hasPrev}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {hotelsPagination.page} of {hotelsPagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set("hotelPage", (hotelsPagination.page + 1).toString());
                      setSearchParams(params);
                    }}
                    disabled={!hotelsPagination.hasNext}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Reservations Tab */}
        <TabsContent value="reservations">
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <Select value={reservationStatusFilter || "ALL"} onValueChange={(value) => setReservationStatusFilter(value === "ALL" ? "" : value)}>
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
          </div>

          {reservationsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reservations yet</h3>
              <p className="text-muted-foreground">
                Reservations for your hotels will appear here
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <Card key={reservation.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {reservation.room?.name} - {reservation.room?.hotel?.name}
                          </CardTitle>
                          <CardDescription>
                            Guest: {reservation.user?.firstName} {reservation.user?.lastName} ({reservation.user?.email})
                          </CardDescription>
                        </div>
                        <Badge variant={statusColors[reservation.status]}>
                          {reservation.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-xs text-muted-foreground">Check-in</div>
                            <div className="text-sm font-medium">
                              {format(new Date(reservation.checkInDate), "MMM dd")}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-xs text-muted-foreground">Check-out</div>
                            <div className="text-sm font-medium">
                              {format(new Date(reservation.checkOutDate), "MMM dd")}
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
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-xs text-muted-foreground">Total</div>
                            <div className="text-sm font-medium">${reservation.totalPrice}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-xs text-muted-foreground">Booked</div>
                            <div className="text-sm font-medium">
                              {format(new Date(reservation.createdAt), "MMM dd")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      {reservation.status === "PENDING" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setUpdateReservation(reservation);
                              setNewStatus("CONFIRMED");
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setUpdateReservation(reservation);
                              setNewStatus("CANCELLED");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                      {reservation.status === "CONFIRMED" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setUpdateReservation(reservation);
                            setNewStatus("COMPLETED");
                          }}
                        >
                          Mark as Completed
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {reservationsPagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set("reservationPage", (reservationsPagination.page - 1).toString());
                      setSearchParams(params);
                    }}
                    disabled={!reservationsPagination.hasPrev}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {reservationsPagination.page} of {reservationsPagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set("reservationPage", (reservationsPagination.page + 1).toString());
                      setSearchParams(params);
                    }}
                    disabled={!reservationsPagination.hasNext}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete hotel confirmation dialog */}
      <Dialog open={!!deleteHotelId} onOpenChange={(open) => !open && setDeleteHotelId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Hotel</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this hotel? This will also delete all rooms and reservations associated with it. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteHotelId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteHotel} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Hotel"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update reservation status dialog */}
      <Dialog open={!!updateReservation} onOpenChange={(open) => !open && setUpdateReservation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Reservation Status</DialogTitle>
            <DialogDescription>
              Change the status of this reservation to "{newStatus}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateReservation(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateReservationStatus} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Confirm"
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
    { title: "Dashboard - LuxStay" },
    { name: "description", content: "Manage your hotels and reservations" },
  ];
}
