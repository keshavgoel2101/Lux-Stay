import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { hotelsApi, roomsApi, type Room } from "~/lib/api";
import { useAuth } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { ArrowLeft, Plus, Edit, Trash2, Loader2, Search, Bed, Users, DollarSign } from "lucide-react";

const roomTypeLabels: Record<string, string> = {
  SINGLE: "Single",
  DOUBLE: "Double",
  TWIN: "Twin",
  SUITE: "Suite",
  DELUXE: "Deluxe",
  PENTHOUSE: "Penthouse",
};

export default function DashboardHotelRooms() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [hotelName, setHotelName] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteRoom, setDeleteRoom] = useState<Room | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);

      try {
        // Fetch hotel details
        const hotelResponse = await hotelsApi.getById(id);
        setHotelName(hotelResponse.hotel.name);

        // Fetch rooms for this hotel
        const params = new URLSearchParams();
        params.set("hotelId", id);
        params.set("limit", "100");
        const roomsResponse = await roomsApi.getAll(params);
        setRooms(roomsResponse.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!token || !deleteRoom) return;

    setIsDeleting(true);
    try {
      await roomsApi.delete(token, deleteRoom.id);
      setRooms(rooms.filter((r) => r.id !== deleteRoom.id));
      setDeleteRoom(null);
    } catch (err) {
      console.error("Failed to delete room:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(search.toLowerCase()) ||
      room.roomType.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{hotelName} - Rooms</h1>
          <p className="text-muted-foreground">Manage rooms for this hotel</p>
        </div>
        <Link to={`/dashboard/hotels/${id}/rooms/new`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Room
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredRooms.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bed className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No rooms found</h3>
            <p className="text-muted-foreground mb-4">
              {search ? "Try a different search term" : "Start by adding your first room"}
            </p>
            {!search && (
              <Link to={`/dashboard/hotels/${id}/rooms/new`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Room
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRooms.map((room) => (
            <Card key={room.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                    <CardDescription>{roomTypeLabels[room.roomType] || room.roomType}</CardDescription>
                  </div>
                  <Badge variant={room.isAvailable ? "default" : "secondary"}>
                    {room.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {room.images && room.images[0] && (
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-full h-32 object-cover rounded-md mb-4"
                  />
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Bed className="h-4 w-4 mr-2" />
                    {roomTypeLabels[room.roomType] || room.roomType}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    Up to {room.capacity} guests
                  </div>
                  <div className="flex items-center text-sm font-semibold">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {room.pricePerNight.toFixed(2)} / night
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/dashboard/hotels/${id}/rooms/${room.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteRoom(room)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteRoom} onOpenChange={() => setDeleteRoom(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Room</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteRoom?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteRoom(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
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
    { title: "Manage Rooms - LuxStay Dashboard" },
    { name: "description", content: "Manage your hotel rooms" },
  ];
}
