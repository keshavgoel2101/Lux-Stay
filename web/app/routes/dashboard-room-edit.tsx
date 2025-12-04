import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { roomsApi, type CreateRoomInput } from "~/lib/api";
import { useAuth } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";

const roomTypes = [
  { value: "SINGLE", label: "Single" },
  { value: "DOUBLE", label: "Double" },
  { value: "TWIN", label: "Twin" },
  { value: "SUITE", label: "Suite" },
  { value: "DELUXE", label: "Deluxe" },
  { value: "PENTHOUSE", label: "Penthouse" },
];

export default function DashboardRoomEdit() {
  const { id: hotelId, roomId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<Omit<CreateRoomInput, "hotelId">>({
    name: "",
    description: "",
    roomType: "DOUBLE",
    capacity: 2,
    pricePerNight: 100,
    images: [],
    amenities: [],
  });

  const [newImage, setNewImage] = useState("");
  const [newAmenity, setNewAmenity] = useState("");

  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) return;
      setIsFetching(true);

      try {
        const response = await roomsApi.getById(roomId);
        const room = response.room;
        setFormData({
          name: room.name,
          description: room.description,
          roomType: room.roomType,
          capacity: room.capacity,
          pricePerNight: room.pricePerNight,
          images: room.images || [],
          amenities: room.amenities || [],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch room");
      } finally {
        setIsFetching(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !roomId) return;

    setIsLoading(true);
    setError("");

    try {
      await roomsApi.update(token, roomId, formData);
      navigate(`/dashboard/hotels/${hotelId}/rooms`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update room");
    } finally {
      setIsLoading(false);
    }
  };

  const addImage = () => {
    if (newImage && !formData.images?.includes(newImage)) {
      setFormData({ ...formData, images: [...(formData.images || []), newImage] });
      setNewImage("");
    }
  };

  const removeImage = (image: string) => {
    setFormData({ ...formData, images: formData.images?.filter((i) => i !== image) });
  };

  const addAmenity = () => {
    if (newAmenity && !formData.amenities?.includes(newAmenity)) {
      setFormData({ ...formData, amenities: [...(formData.amenities || []), newAmenity] });
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData({ ...formData, amenities: formData.amenities?.filter((a) => a !== amenity) });
  };

  if (isFetching) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button
        variant="ghost"
        onClick={() => navigate(`/dashboard/hotels/${hotelId}/rooms`)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Rooms
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Room</CardTitle>
          <CardDescription>Update the room details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Room Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Ocean View Suite"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this room..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type *</Label>
                <Select
                  value={formData.roomType}
                  onValueChange={(value: "SINGLE" | "DOUBLE" | "TWIN" | "SUITE" | "DELUXE" | "PENTHOUSE") => 
                    setFormData({ ...formData, roomType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  max={20}
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerNight">Price per Night ($) *</Label>
                <Input
                  id="pricePerNight"
                  type="number"
                  min={1}
                  step="0.01"
                  value={formData.pricePerNight}
                  onChange={(e) => setFormData({ ...formData, pricePerNight: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Images</Label>
              <div className="flex gap-2">
                <Input
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <Button type="button" variant="outline" onClick={addImage}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.images && formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.images.map((image) => (
                    <div key={image} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm">
                      <span className="truncate max-w-[200px]">{image}</span>
                      <button type="button" onClick={() => removeImage(image)}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Amenities</Label>
              <div className="flex gap-2">
                <Input
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="e.g., King Bed, TV, Mini Bar"
                />
                <Button type="button" variant="outline" onClick={addAmenity}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.amenities && formData.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm">
                      <span>{amenity}</span>
                      <button type="button" onClick={() => removeAmenity(amenity)}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/dashboard/hotels/${hotelId}/rooms`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function meta() {
  return [
    { title: "Edit Room - LuxStay Dashboard" },
    { name: "description", content: "Edit room details" },
  ];
}
