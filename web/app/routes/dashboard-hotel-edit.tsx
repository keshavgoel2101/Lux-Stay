import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { hotelsApi, type CreateHotelInput } from "~/lib/api";
import { useAuth } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";

export default function DashboardHotelEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<CreateHotelInput>({
    name: "",
    description: "",
    address: "",
    city: "",
    country: "",
    images: [],
    amenities: [],
  });

  const [newImage, setNewImage] = useState("");
  const [newAmenity, setNewAmenity] = useState("");

  useEffect(() => {
    const fetchHotel = async () => {
      if (!id) return;
      setIsFetching(true);

      try {
        const response = await hotelsApi.getById(id);
        const hotel = response.hotel;
        setFormData({
          name: hotel.name,
          description: hotel.description,
          address: hotel.address,
          city: hotel.city,
          country: hotel.country,
          images: hotel.images || [],
          amenities: hotel.amenities || [],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch hotel");
      } finally {
        setIsFetching(false);
      }
    };

    fetchHotel();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id) return;

    setIsLoading(true);
    setError("");

    try {
      await hotelsApi.update(token, id, formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update hotel");
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
      <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Hotel</CardTitle>
          <CardDescription>
            Update the details of your hotel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Hotel Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Grand Luxury Hotel"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your hotel..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main Street"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="New York"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="United States"
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
                  placeholder="e.g., WiFi, Pool, Gym"
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
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
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
    { title: "Edit Hotel - LuxStay Dashboard" },
    { name: "description", content: "Edit your hotel details" },
  ];
}
