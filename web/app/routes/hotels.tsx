import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { hotelsApi, type Hotel, type PaginatedResponse } from "~/lib/api";
import { useAuth } from "~/lib/auth";
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
  Building2,
  Bed
} from "lucide-react";

export default function Hotels() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { token } = useAuth();
  const [hotels, setHotels] = useState<Hotel[]>([]);
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
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "createdAt");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "desc");

  const fetchHotels = async () => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      params.set("page", searchParams.get("page") || "1");
      params.set("limit", "9");
      if (search) params.set("search", search);
      if (city) params.set("city", city);
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);

      const response = await hotelsApi.getAll(params, token);
      setHotels(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch hotels");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (search) params.set("search", search);
    else params.delete("search");
    if (city) params.set("city", city);
    else params.delete("city");
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
    setCity("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setSearchParams({});
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Hotels</h1>
        <p className="text-muted-foreground">
          Discover luxury accommodations around the world
        </p>
      </div>

      {/* Filters */}
      <div className="bg-muted/30 rounded-lg p-4 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hotels..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="rating-desc">Highest Rating</SelectItem>
                  <SelectItem value="rating-asc">Lowest Rating</SelectItem>
                  <SelectItem value="name-asc">Name A-Z</SelectItem>
                  <SelectItem value="name-desc">Name Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
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
          {pagination.total} hotels found
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
          <Button variant="outline" onClick={fetchHotels} className="mt-4">
            Try Again
          </Button>
        </div>
      )}

      {/* Hotels grid */}
      {!isLoading && !error && (
        <>
          {hotels.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hotels found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <Link key={hotel.id} to={`/hotels/${hotel.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="relative">
                      <ImageCarousel
                        images={hotel.images || []}
                        alt={hotel.name}
                        fallback={
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                            <Building2 className="h-12 w-12 text-primary/50" />
                          </div>
                        }
                      />
                      <Badge className="absolute top-3 right-3 z-10" variant="secondary">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {hotel.rating.toFixed(1)}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{hotel.name}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {hotel.city}, {hotel.country}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {hotel.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Bed className="h-4 w-4 mr-1" />
                        {hotel._count?.rooms || 0} rooms
                      </div>
                      {hotel.amenities && hotel.amenities.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {hotel.amenities.length} amenities
                        </Badge>
                      )}
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
    { title: "Browse Hotels - LuxStay" },
    { name: "description", content: "Explore luxury hotels worldwide" },
  ];
}
