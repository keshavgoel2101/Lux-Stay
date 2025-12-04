import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { roomsApi, reservationsApi, type RoomWithHotel } from "~/lib/api";
import { useAuth } from "~/lib/auth";
import { useCurrency } from "~/lib/currency";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { ImageCarousel } from "~/components/image-carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { 
  MapPin, 
  Star, 
  Loader2, 
  ArrowLeft,
  Bed,
  Users,
  Calendar,
  CheckCircle,
  Wifi,
  Tv,
  Wind,
  Coffee,
  Bath
} from "lucide-react";
import { format, differenceInDays } from "date-fns";

const roomTypeLabels: Record<string, string> = {
  SINGLE: "Single Room",
  DOUBLE: "Double Room",
  TWIN: "Twin Room",
  SUITE: "Suite",
  DELUXE: "Deluxe Room",
  PENTHOUSE: "Penthouse",
};

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-4 w-4" />,
  tv: <Tv className="h-4 w-4" />,
  "air conditioning": <Wind className="h-4 w-4" />,
  "mini bar": <Coffee className="h-4 w-4" />,
  "private bathroom": <Bath className="h-4 w-4" />,
};

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, token, user } = useAuth();
  const { formatPrice } = useCurrency();
  const [room, setRoom] = useState<RoomWithHotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Booking form state
  const [bookingOpen, setBookingOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!id) return;
      setIsLoading(true);
      setError("");

      try {
        const response = await roomsApi.getById(id);
        setRoom(response.room);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch room");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const calculateTotalPrice = () => {
    if (!checkInDate || !checkOutDate || !room) return 0;
    const nights = differenceInDays(new Date(checkOutDate), new Date(checkInDate));
    return nights > 0 ? nights * room.pricePerNight : 0;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id) return;

    setIsBooking(true);
    setBookingError("");

    try {
      await reservationsApi.create(token, {
        roomId: id,
        checkInDate,
        checkOutDate,
        guestCount,
        specialRequests: specialRequests || undefined,
      });
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingOpen(false);
        navigate("/reservations");
      }, 2000);
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : "Failed to create reservation");
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-destructive mb-4">{error || "Room not found"}</p>
        <Button variant="outline" onClick={() => navigate("/rooms")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Rooms
        </Button>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();
  const nights = checkInDate && checkOutDate 
    ? differenceInDays(new Date(checkOutDate), new Date(checkInDate))
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Images */}
          <div className="mb-6">
            <ImageCarousel
              images={room.images || []}
              alt={room.name}
              showThumbnails={true}
              fallback={
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                  <Bed className="h-24 w-24 text-primary/50" />
                </div>
              }
            />
          </div>

          {/* Room info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <Badge className="mb-2">{roomTypeLabels[room.roomType]}</Badge>
                  <h1 className="text-3xl font-bold">{room.name}</h1>
                </div>
              </div>
              <Link 
                to={`/hotels/${room.hotel.id}`}
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <MapPin className="h-5 w-5 mr-2" />
                {room.hotel.name} - {room.hotel.city}, {room.hotel.country}
                <Badge variant="secondary" className="ml-2">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {room.hotel.rating.toFixed(1)}
                </Badge>
              </Link>
            </div>

            <Separator />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Capacity</div>
                  <div className="font-semibold">{room.capacity} guests</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Bed className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Room Type</div>
                  <div className="font-semibold">{roomTypeLabels[room.roomType]}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Price</div>
                  <div className="font-semibold">{formatPrice(room.pricePerNight)}/night</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="font-semibold text-green-500">Available</div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground">{room.description}</p>
            </div>

            {room.amenities && room.amenities.length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="text-xl font-semibold mb-3">Room Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                        {amenityIcons[amenity.toLowerCase()] || null}
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Booking sidebar */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Book This Room</span>
                <span className="text-2xl">
                  {formatPrice(room.pricePerNight)}
                  <span className="text-sm font-normal text-muted-foreground">/night</span>
                </span>
              </CardTitle>
              <CardDescription>
                Reserve your stay at {room.hotel.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAuthenticated ? (
                <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <Calendar className="h-4 w-4 mr-2" />
                      Reserve Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {bookingSuccess ? (
                      <div className="text-center py-8">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <DialogTitle className="text-xl mb-2">Reservation Confirmed!</DialogTitle>
                        <DialogDescription>
                          Your booking has been created successfully. Redirecting to your reservations...
                        </DialogDescription>
                      </div>
                    ) : (
                      <>
                        <DialogHeader>
                          <DialogTitle>Complete Your Reservation</DialogTitle>
                          <DialogDescription>
                            Fill in the details below to book {room.name}
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleBooking}>
                          <div className="space-y-4 py-4">
                            {bookingError && (
                              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                                {bookingError}
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="checkIn">Check-in Date</Label>
                                <Input
                                  id="checkIn"
                                  type="date"
                                  value={checkInDate}
                                  onChange={(e) => setCheckInDate(e.target.value)}
                                  min={format(new Date(), "yyyy-MM-dd")}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="checkOut">Check-out Date</Label>
                                <Input
                                  id="checkOut"
                                  type="date"
                                  value={checkOutDate}
                                  onChange={(e) => setCheckOutDate(e.target.value)}
                                  min={checkInDate || format(new Date(), "yyyy-MM-dd")}
                                  required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="guests">Number of Guests</Label>
                              <Input
                                id="guests"
                                type="number"
                                min={1}
                                max={room.capacity}
                                value={guestCount}
                                onChange={(e) => setGuestCount(parseInt(e.target.value))}
                                required
                              />
                              <p className="text-xs text-muted-foreground">
                                Maximum {room.capacity} guests
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="requests">Special Requests (Optional)</Label>
                              <Textarea
                                id="requests"
                                placeholder="Any special requests or requirements..."
                                value={specialRequests}
                                onChange={(e) => setSpecialRequests(e.target.value)}
                              />
                            </div>
                            {totalPrice > 0 && (
                              <div className="p-4 bg-muted rounded-lg">
                                <div className="flex justify-between text-sm mb-2">
                                  <span>{formatPrice(room.pricePerNight)} × {nights} nights</span>
                                  <span>{formatPrice(totalPrice)}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-semibold">
                                  <span>Total</span>
                                  <span>{formatPrice(totalPrice)}</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            <Button type="submit" disabled={isBooking || !checkInDate || !checkOutDate}>
                              {isBooking ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Booking...
                                </>
                              ) : (
                                "Confirm Reservation"
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Please sign in to make a reservation
                  </p>
                  <Button asChild className="w-full">
                    <Link to={`/login?redirect=/rooms/${id}`}>
                      Sign in to Book
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col text-xs text-muted-foreground">
              <p>• Free cancellation up to 24 hours before check-in</p>
              <p>• Instant confirmation</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function meta() {
  return [
    { title: "Room Details - LuxStay" },
    { name: "description", content: "View room details and make a reservation" },
  ];
}
