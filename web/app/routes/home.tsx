import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { 
  Hotel, 
  Search, 
  Star, 
  Shield, 
  Clock, 
  MapPin, 
  Users, 
  Sparkles,
  ArrowRight,
  Building2,
  Bed,
  Calendar
} from "lucide-react";

// Featured destination images
const featuredDestinations = [
  {
    city: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop",
    hotels: 45,
  },
  {
    city: "New York",
    country: "USA",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop",
    hotels: 78,
  },
  {
    city: "Tokyo",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop",
    hotels: 62,
  },
  {
    city: "Dubai",
    country: "UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
    hotels: 53,
  },
];

// Gallery images showcasing luxury stays
const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    alt: "Luxury resort pool",
  },
  {
    src: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop",
    alt: "Elegant hotel lobby",
  },
  {
    src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop",
    alt: "Premium suite bedroom",
  },
  {
    src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
    alt: "Beachfront hotel",
  },
  {
    src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop",
    alt: "Grand hotel exterior",
  },
  {
    src: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=400&fit=crop",
    alt: "Luxury bathroom",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1920&h=1080&fit=crop"
            alt="Luxury hotel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-gradient-gold text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
              <Sparkles className="h-4 w-4" />
              Your Perfect Stay Awaits
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Discover Luxury Hotels
              <span className="block text-primary">Worldwide</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Experience exceptional comfort and world-class hospitality. 
              Book your dream stay at handpicked luxury hotels across the globe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="text-lg px-8">
                <Link to="/hotels">
                  <Search className="mr-2 h-5 w-5" />
                  Explore Hotels
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 bg-background/50 backdrop-blur-sm">
                <Link to="/register?role=HOTEL_OWNER">
                  <Building2 className="mr-2 h-5 w-5" />
                  List Your Property
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gold mb-2">500+</div>
              <div className="text-primary-foreground/80">Luxury Hotels</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gold mb-2">50+</div>
              <div className="text-primary-foreground/80">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gold mb-2">10K+</div>
              <div className="text-primary-foreground/80">Happy Guests</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gold mb-2">4.9</div>
              <div className="text-primary-foreground/80">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popular Destinations
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our most sought-after locations with world-class accommodations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((destination) => (
              <Link 
                key={destination.city} 
                to={`/hotels?city=${destination.city}`}
                className="group"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.city}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-1">{destination.city}</h3>
                    <p className="text-white/80 text-sm">{destination.country}</p>
                    <Badge variant="secondary" className="mt-2">
                      {destination.hotels} hotels
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose LuxStay?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide the best experience for both travelers and hotel owners
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Curated Selection</h3>
                <p className="text-muted-foreground">
                  Only the finest hotels make it to our platform. Every property is 
                  carefully vetted for quality and service.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
                <p className="text-muted-foreground">
                  Your reservations are protected with our secure booking system. 
                  Book with confidence every time.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-muted-foreground">
                  Our dedicated support team is available around the clock to 
                  assist you with any queries.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Book your perfect stay in just a few simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-gold text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">
                1
              </div>
              <h3 className="font-semibold mb-2">Search</h3>
              <p className="text-sm text-muted-foreground">
                Find hotels by location, dates, or amenities
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-gold text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">
                2
              </div>
              <h3 className="font-semibold mb-2">Compare</h3>
              <p className="text-sm text-muted-foreground">
                Review rooms, prices, and guest ratings
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-gold text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">
                3
              </div>
              <h3 className="font-semibold mb-2">Book</h3>
              <p className="text-sm text-muted-foreground">
                Reserve your room securely in minutes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-gold text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">
                4
              </div>
              <h3 className="font-semibold mb-2">Enjoy</h3>
              <p className="text-sm text-muted-foreground">
                Experience luxury and comfort
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Hotel Owners */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-gold text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
                <Building2 className="h-4 w-4" />
                For Hotel Owners
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Grow Your Business with LuxStay
              </h2>
              <p className="text-muted-foreground mb-6">
                Join our platform and reach thousands of travelers looking for 
                exceptional stays. Manage your properties effortlessly with our 
                intuitive dashboard.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <MapPin className="h-3 w-3 text-accent-foreground" />
                  </div>
                  <span>Global visibility for your properties</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <Bed className="h-3 w-3 text-accent-foreground" />
                  </div>
                  <span>Easy room and availability management</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <Calendar className="h-3 w-3 text-accent-foreground" />
                  </div>
                  <span>Real-time reservation tracking</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <Users className="h-3 w-3 text-accent-foreground" />
                  </div>
                  <span>Guest management tools</span>
                </li>
              </ul>
              <Button size="lg" asChild>
                <Link to="/register?role=HOTEL_OWNER">
                  Start Listing Your Hotel
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl p-8 lg:p-12">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-accent/30">
                    <CardContent className="p-6 text-center">
                      <Hotel className="h-8 w-8 text-gold mx-auto mb-2" />
                      <div className="text-2xl font-bold text-primary">500+</div>
                      <div className="text-xs text-muted-foreground">Hotels Listed</div>
                    </CardContent>
                  </Card>
                  <Card className="border-accent/30">
                    <CardContent className="p-6 text-center">
                      <Users className="h-8 w-8 text-gold mx-auto mb-2" />
                      <div className="text-2xl font-bold text-primary">10K+</div>
                      <div className="text-xs text-muted-foreground">Bookings</div>
                    </CardContent>
                  </Card>
                  <Card className="col-span-2 border-accent/30">
                    <CardContent className="p-6 text-center">
                      <Star className="h-8 w-8 text-gold mx-auto mb-2" />
                      <div className="text-2xl font-bold text-primary">98%</div>
                      <div className="text-xs text-muted-foreground">Partner Satisfaction</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Experience Luxury
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Take a glimpse at the exceptional experiences waiting for you
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <div 
                key={index}
                className={`relative overflow-hidden rounded-xl ${
                  index === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className={`w-full object-cover hover:scale-105 transition-transform duration-500 ${
                    index === 0 ? "h-full min-h-[300px] md:min-h-[500px]" : "aspect-video"
                  }`}
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button size="lg" variant="outline" asChild>
              <Link to="/rooms">
                View All Rooms
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Stay?
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Join thousands of travelers who trust LuxStay for their luxury 
            accommodations. Start exploring today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-lg px-8">
              <Link to="/hotels">
                Browse Hotels
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/register">
                Create Account
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export function meta() {
  return [
    { title: "LuxStay - Luxury Hotel Booking" },
    { name: "description", content: "Discover and book luxury hotels worldwide. Experience exceptional comfort and world-class hospitality with LuxStay." },
  ];
}
