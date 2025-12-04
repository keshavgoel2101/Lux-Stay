import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { hotelsApi, type HotelWithRooms, type Room } from "~/lib/api";
import { useAuth } from "~/lib/auth";
import { useCurrency } from "~/lib/currency";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { ImageCarousel } from "~/components/image-carousel";
import { 
  MapPin, 
  Star, 
  Loader2, 
  ArrowLeft,
  Building2,
  Bed,
  Users,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  UtensilsCrossed
} from "lucide-react";

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-4 w-4" />,
  parking: <Car className="h-4 w-4" />,
  breakfast: <Coffee className="h-4 w-4" />,
  gym: <Dumbbell className="h-4 w-4" />,
  pool: <Waves className="h-4 w-4" />,
  restaurant: <UtensilsCrossed className="h-4 w-4" />,
};

const roomTypeLabels: Record<string, string> = {
  SINGLE: "Single",
  DOUBLE: "Double",
  TWIN: "Twin",
  SUITE: "Suite",
  DELUXE: "Deluxe",
  PENTHOUSE: "Penthouse",
};

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { formatPrice } = useCurrency();
  const [hotel, setHotel] = useState<HotelWithRooms | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotel = async () => {
      if (!id) return;
      setIsLoading(true);
      setError("");

      try {
        const response = await hotelsApi.getById(id);
        setHotel(response.hotel);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch hotel");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-destructive mb-4">{error || "Hotel not found"}</p>
        <Button variant="outline" onClick={() => navigate("/hotels")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Hotels
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Button variant="ghost" onClick={() => navigate("/hotels")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Hotels
      </Button>

      {/* Hotel header */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Images */}
          <div className="mb-6">
            <ImageCarousel
              images={hotel.images || []}
              alt={hotel.name}
              showThumbnails={true}
              fallback={
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                  <Building2 className="h-24 w-24 text-primary/50" />
                </div>
              }
            />
          </div>

          {/* Hotel info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{hotel.name}</h1>
                <Badge className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {hotel.rating.toFixed(1)}
                </Badge>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-5 w-5 mr-2" />
                {hotel.address}, {hotel.city}, {hotel.country}
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">About</h2>
              <p className="text-muted-foreground">{hotel.description}</p>
            </div>

            {hotel.amenities && hotel.amenities.length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.map((amenity) => (
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

        {/* Sidebar */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Hotel Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rooms Available</span>
                <span className="font-semibold">{hotel.rooms?.length || 0}</span>
              </div>
              {hotel.owner && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Managed by</span>
                  <span className="font-semibold">
                    {hotel.owner.firstName} {hotel.owner.lastName}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Available Rooms */}
      <Separator className="my-8" />

      <div>
        <h2 className="text-2xl font-bold mb-6">Available Rooms</h2>
        
        {hotel.rooms && hotel.rooms.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotel.rooms.map((room) => (
              <Card key={room.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative">
                  <ImageCarousel
                    images={room.images || []}
                    alt={room.name}
                    fallback={
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                        <Bed className="h-8 w-8 text-primary/50" />
                      </div>
                    }
                  />
                  <Badge className="absolute top-3 right-3 z-10">
                    {roomTypeLabels[room.roomType]}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{room.name}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {room.capacity} guests
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {room.description}
                  </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="flex items-center text-lg font-bold">
                    {formatPrice(room.pricePerNight)}
                    <span className="text-sm font-normal text-muted-foreground">/night</span>
                  </div>
                  <Button asChild>
                    <Link to={`/rooms/${room.id}`}>View Room</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <Bed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No rooms available at this hotel</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function meta() {
  return [
    { title: "Hotel Details - LuxStay" },
    { name: "description", content: "View hotel details and available rooms" },
  ];
}
