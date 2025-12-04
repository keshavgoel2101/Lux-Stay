import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { roomsApi, type Room, type PaginatedResponse } from "~/lib/api";
import { useAuth } from "~/lib/auth";
import { useCurrency } from "~/lib/currency";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { ImageCarousel } from "~/components/image-carousel";
import { 
  Search, 
  MapPin, 
  Star, 
  Loader2, 
  ChevronLeft, 
  ChevronRight,
  SlidersHorizontal,
  Bed,
  Users
} from "lucide-react";

const roomTypeLabels: Record<string, string> = {
  SINGLE: "Single",
  DOUBLE: "Double",
  TWIN: "Twin",
  SUITE: "Suite",
  DELUXE: "Deluxe",
  PENTHOUSE: "Penthouse",
};

export default function Rooms() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { token } = useAuth();
  const { formatPrice } = useCurrency();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [roomType, setRoomType] = useState(searchParams.get("roomType") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minCapacity, setMinCapacity] = useState(searchParams.get("minCapacity") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "createdAt");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "desc");

  const fetchRooms = async () => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      params.set("page", searchParams.get("page") || "1");
      params.set("limit", "9");
      params.set("isAvailable", "true");
      if (search) params.set("search", search);
      if (roomType) params.set("roomType", roomType);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (minCapacity) params.set("minCapacity", minCapacity);
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);

      const response = await roomsApi.getAll(params, token);
      setRooms(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch rooms");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("page", "1");
    if (search) params.set("search", search);
    if (roomType) params.set("roomType", roomType);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minCapacity) params.set("minCapacity", minCapacity);
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
  };

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split("-");
    setSortBy(newSortBy!);
    setSortOrder(newSortOrder!);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("sortBy", newSortBy!);
    params.set("sortOrder", newSortOrder!);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearch("");
    setRoomType("");
    setMinPrice("");
    setMaxPrice("");
    setMinCapacity("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setSearchParams({});
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Rooms</h1>
        <p className="text-muted-foreground">
          Browse available rooms across all our partner hotels
        </p>
      </div>

      {/* Filters */}
      <div className="bg-muted/30 rounded-lg p-4 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rooms..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select value={roomType || "ALL"} onValueChange={(value) => setRoomType(value === "ALL" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Room Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="SINGLE">Single</SelectItem>
                  <SelectItem value="DOUBLE">Double</SelectItem>
                  <SelectItem value="TWIN">Twin</SelectItem>
                  <SelectItem value="SUITE">Suite</SelectItem>
                  <SelectItem value="DELUXE">Deluxe</SelectItem>
                  <SelectItem value="PENTHOUSE">Penthouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Min Guests"
                value={minCapacity}
                onChange={(e) => setMinCapacity(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={`${sortBy}-${sortOrder}`} onValueChange={handleSortChange}>
              <SelectTrigger className="w-48">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="pricePerNight-asc">Price: Low to High</SelectItem>
                <SelectItem value="pricePerNight-desc">Price: High to Low</SelectItem>
                <SelectItem value="capacity-desc">Capacity: High to Low</SelectItem>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button type="button" variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </form>
      </div>

      {/* Results info */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {pagination.total} rooms found
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
          <Button variant="outline" onClick={fetchRooms} className="mt-4">
            Try Again
          </Button>
        </div>
      )}

      {/* Rooms grid */}
      {!isLoading && !error && (
        <>
          {rooms.length === 0 ? (
            <div className="text-center py-12">
              <Bed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No rooms found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <Link key={room.id} to={`/rooms/${room.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="relative">
                      <ImageCarousel
                        images={room.images || []}
                        alt={room.name}
                        fallback={
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                            <Bed className="h-12 w-12 text-primary/50" />
                          </div>
                        }
                      />
                      <Badge className="absolute top-3 left-3 z-10">
                        {roomTypeLabels[room.roomType]}
                      </Badge>
                      {room.hotel && (
                        <Badge variant="secondary" className="absolute top-3 right-3 z-10">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {room.hotel.rating.toFixed(1)}
                        </Badge>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{room.name}</CardTitle>
                      {room.hotel && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          {room.hotel.name} - {room.hotel.city}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {room.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-1" />
                          {room.capacity}
                        </span>
                      </div>
                      <div className="flex items-center text-lg font-bold">
                        {formatPrice(room.pricePerNight)}
                        <span className="text-sm font-normal text-muted-foreground">/night</span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
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
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    const current = pagination.page;
                    return (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= current - 1 && page <= current + 1)
                    );
                  })
                  .map((page, index, array) => (
                    <span key={page} className="flex items-center">
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={page === pagination.page ? "default" : "outline"}
                        size="icon"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    </span>
                  ))}
              </div>
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
    </div>
  );
}

export function meta() {
  return [
    { title: "Find Rooms - LuxStay" },
    { name: "description", content: "Browse available rooms at luxury hotels" },
  ];
}
