import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // Clean existing data
  await prisma.reservation.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleaned existing data");

  const hashedPassword = await bcrypt.hash("123123123", 10);

  // Create single hotel owner
  const owner = await prisma.user.create({
    data: {
      email: "owner@luxstay.com",
      password: hashedPassword,
      firstName: "John",
      lastName: "Smith",
      role: "HOTEL_OWNER",
    },
  });

  // Create a client user
  const client = await prisma.user.create({
    data: {
      email: "client@example.com",
      password: hashedPassword,
      firstName: "Jane",
      lastName: "Doe",
      role: "CLIENT",
    },
  });

  console.log("👤 Created users");

  // Create hotels with rooms - all with multiple images
  const hotels = [
    {
      name: "The Grand Luxe Hotel",
      description: "Experience unparalleled luxury at The Grand Luxe Hotel, where modern elegance meets timeless sophistication. Our five-star property offers breathtaking city views, world-class dining, and impeccable service.",
      address: "123 Luxury Avenue",
      city: "New York",
      country: "United States",
      rating: 4.8,
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      ],
      amenities: ["Pool", "Spa", "Gym", "Restaurant", "Bar", "Room Service", "Concierge", "Valet Parking"],
      rooms: [
        {
          name: "Standard King Room",
          description: "Comfortable king-sized bed with city views, work desk, and modern amenities.",
          roomType: "DOUBLE" as const,
          pricePerNight: 299,
          capacity: 2,
          images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
          ],
          amenities: ["King Bed", "City View", "Wi-Fi", "Mini Bar", "Safe"],
        },
        {
          name: "Deluxe Suite",
          description: "Spacious suite with separate living area, premium amenities, and stunning panoramic views.",
          roomType: "SUITE" as const,
          pricePerNight: 599,
          capacity: 3,
          images: [
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
          ],
          amenities: ["King Bed", "Living Room", "Jacuzzi Tub", "Panoramic Views", "Butler Service"],
        },
        {
          name: "Presidential Penthouse",
          description: "The ultimate luxury experience with private terrace, personal butler, and exclusive amenities.",
          roomType: "PENTHOUSE" as const,
          pricePerNight: 2499,
          capacity: 4,
          images: [
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          ],
          amenities: ["Private Terrace", "Butler Service", "Dining Room", "Private Bar"],
        },
      ],
    },
    {
      name: "Oceanfront Paradise Resort",
      description: "Nestled on pristine white sand beaches, Oceanfront Paradise Resort offers a tropical escape with stunning ocean views and exceptional hospitality.",
      address: "456 Beachfront Drive",
      city: "Miami",
      country: "United States",
      rating: 4.6,
      images: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      ],
      amenities: ["Private Beach", "Pool", "Spa", "Water Sports", "Restaurant", "Beach Bar", "Kids Club"],
      rooms: [
        {
          name: "Ocean View Room",
          description: "Wake up to breathtaking ocean views in this beautifully appointed room.",
          roomType: "DOUBLE" as const,
          pricePerNight: 399,
          capacity: 2,
          images: [
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
            "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          ],
          amenities: ["Ocean View", "Balcony", "King Bed", "Mini Bar"],
        },
        {
          name: "Beachfront Suite",
          description: "Step directly onto the sand from this exclusive beachfront suite.",
          roomType: "SUITE" as const,
          pricePerNight: 799,
          capacity: 4,
          images: [
            "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          ],
          amenities: ["Direct Beach Access", "Private Patio", "Kitchen", "Living Room"],
        },
        {
          name: "Garden View Single",
          description: "Cozy single room overlooking our lush tropical gardens.",
          roomType: "SINGLE" as const,
          pricePerNight: 199,
          capacity: 1,
          images: [
            "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800",
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
          ],
          amenities: ["Garden View", "Queen Bed", "Wi-Fi"],
        },
      ],
    },
    {
      name: "Alpine Mountain Lodge",
      description: "Escape to the mountains at Alpine Mountain Lodge, where cozy luxury meets stunning alpine scenery. Perfect for ski enthusiasts.",
      address: "789 Mountain Road",
      city: "Aspen",
      country: "United States",
      rating: 4.9,
      images: [
        "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=800",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      ],
      amenities: ["Ski-in/Ski-out", "Hot Tub", "Fireplace", "Restaurant", "Ski Storage", "Sauna"],
      rooms: [
        {
          name: "Mountain View Cabin",
          description: "Rustic charm meets modern comfort with stunning mountain panoramas.",
          roomType: "DOUBLE" as const,
          pricePerNight: 449,
          capacity: 2,
          images: [
            "https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800",
            "https://images.unsplash.com/photo-1609602644356-e37dc1b5bf3b?w=800",
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
          ],
          amenities: ["Mountain View", "Fireplace", "King Bed", "Heated Floors"],
        },
        {
          name: "Ski Chalet Suite",
          description: "Luxurious suite with private balcony overlooking the slopes.",
          roomType: "SUITE" as const,
          pricePerNight: 899,
          capacity: 4,
          images: [
            "https://images.unsplash.com/photo-1609602644356-e37dc1b5bf3b?w=800",
            "https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          ],
          amenities: ["Slope View", "Private Balcony", "Living Room", "Kitchenette"],
        },
      ],
    },
    {
      name: "Le Château Parisien",
      description: "An exquisite boutique hotel in the heart of Paris, offering classic French elegance and gourmet dining.",
      address: "15 Rue de la Paix",
      city: "Paris",
      country: "France",
      rating: 4.7,
      images: [
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      ],
      amenities: ["Restaurant", "Wine Cellar", "Concierge", "Room Service", "Garden", "Library"],
      rooms: [
        {
          name: "Classic Parisian Room",
          description: "Elegant room featuring traditional French décor and city views.",
          roomType: "DOUBLE" as const,
          pricePerNight: 379,
          capacity: 2,
          images: [
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          ],
          amenities: ["City View", "King Bed", "Marble Bathroom", "Mini Bar"],
        },
        {
          name: "Eiffel Tower View Suite",
          description: "Wake up to magnificent views of the Eiffel Tower from this luxurious suite.",
          roomType: "SUITE" as const,
          pricePerNight: 1299,
          capacity: 3,
          images: [
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          ],
          amenities: ["Eiffel Tower View", "Private Terrace", "Living Room", "Champagne Bar"],
        },
      ],
    },
    {
      name: "Tokyo Sky Tower Hotel",
      description: "Experience the perfect blend of traditional Japanese hospitality and cutting-edge modernity with stunning city views.",
      address: "1-1-1 Shibuya",
      city: "Tokyo",
      country: "Japan",
      rating: 4.8,
      images: [
        "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      ],
      amenities: ["Onsen", "Rooftop Bar", "Restaurant", "Spa", "Fitness Center", "Tea Ceremony Room"],
      rooms: [
        {
          name: "Standard City Room",
          description: "Modern comfort with expansive city views and traditional Japanese touches.",
          roomType: "DOUBLE" as const,
          pricePerNight: 299,
          capacity: 2,
          images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
          ],
          amenities: ["City View", "King Bed", "Wi-Fi", "Green Tea Set"],
        },
        {
          name: "Japanese Suite",
          description: "Traditional tatami room with modern luxuries and breathtaking skyline views.",
          roomType: "SUITE" as const,
          pricePerNight: 699,
          capacity: 3,
          images: [
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          ],
          amenities: ["Tatami Floor", "Futon Beds", "Private Onsen", "Tea Room"],
        },
        {
          name: "Deluxe Skyline Room",
          description: "Elevated luxury with floor-to-ceiling windows showcasing Tokyo's brilliant skyline.",
          roomType: "DELUXE" as const,
          pricePerNight: 499,
          capacity: 2,
          images: [
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
          ],
          amenities: ["Floor-to-ceiling Windows", "King Bed", "Rain Shower", "Premium Mini Bar"],
        },
      ],
    },
    {
      name: "Santorini Sunset Villas",
      description: "Perched on the dramatic cliffs of Santorini, our villas offer uninterrupted views of the caldera and legendary sunsets.",
      address: "Oia Village",
      city: "Santorini",
      country: "Greece",
      rating: 4.9,
      images: [
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
        "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
        "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
      ],
      amenities: ["Private Pool", "Sunset Views", "Wine Tasting", "Spa", "Restaurant", "Yacht Charter"],
      rooms: [
        {
          name: "Caldera View Room",
          description: "Romantic room carved into the cliff with stunning caldera views.",
          roomType: "DOUBLE" as const,
          pricePerNight: 449,
          capacity: 2,
          images: [
            "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800",
            "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
            "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
          ],
          amenities: ["Caldera View", "King Bed", "Private Terrace", "Outdoor Jacuzzi"],
        },
        {
          name: "Honeymoon Suite",
          description: "The ultimate romantic escape with private infinity pool and sunset views.",
          roomType: "SUITE" as const,
          pricePerNight: 999,
          capacity: 2,
          images: [
            "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
            "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800",
            "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
            "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
          ],
          amenities: ["Private Infinity Pool", "Sunset View", "Champagne Service", "Couples Spa"],
        },
        {
          name: "Cave Penthouse",
          description: "Unique two-level cave penthouse with private pool and 360-degree views.",
          roomType: "PENTHOUSE" as const,
          pricePerNight: 1899,
          capacity: 4,
          images: [
            "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
            "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
            "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800",
          ],
          amenities: ["360° Views", "Two Levels", "Private Pool", "Full Kitchen", "Butler Service"],
        },
      ],
    },
    {
      name: "Dubai Marina Luxury Resort",
      description: "Experience opulent Arabian hospitality with stunning views of the marina and world-class amenities.",
      address: "Marina Walk, Dubai Marina",
      city: "Dubai",
      country: "United Arab Emirates",
      rating: 4.7,
      images: [
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      ],
      amenities: ["Infinity Pool", "Private Beach", "Spa", "Fine Dining", "Shopping Arcade", "Concierge"],
      rooms: [
        {
          name: "Marina View Room",
          description: "Elegant room with panoramic views of Dubai Marina and the Arabian Gulf.",
          roomType: "DOUBLE" as const,
          pricePerNight: 549,
          capacity: 2,
          images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
          ],
          amenities: ["Marina View", "King Bed", "Marble Bathroom", "Smart TV"],
        },
        {
          name: "Royal Suite",
          description: "Lavish suite with butler service and exclusive access to the executive lounge.",
          roomType: "SUITE" as const,
          pricePerNight: 1499,
          capacity: 4,
          images: [
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
          ],
          amenities: ["Butler Service", "Executive Lounge", "Private Dining", "Jacuzzi"],
        },
      ],
    },
    {
      name: "Bali Serenity Retreat",
      description: "Find your inner peace nestled among lush rice terraces with authentic Balinese experiences and wellness programs.",
      address: "Ubud Rice Terraces",
      city: "Ubud",
      country: "Indonesia",
      rating: 4.8,
      images: [
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
        "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800",
        "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800",
      ],
      amenities: ["Yoga Studio", "Spa", "Organic Restaurant", "Rice Terrace Views", "Meditation Garden", "Pool"],
      rooms: [
        {
          name: "Rice Terrace Villa",
          description: "Private villa overlooking the stunning rice terraces with outdoor shower.",
          roomType: "SUITE" as const,
          pricePerNight: 399,
          capacity: 2,
          images: [
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
            "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800",
          ],
          amenities: ["Private Pool", "Rice Terrace View", "Outdoor Shower", "Day Bed"],
        },
        {
          name: "Garden Bungalow",
          description: "Charming bungalow surrounded by tropical gardens and natural beauty.",
          roomType: "DOUBLE" as const,
          pricePerNight: 249,
          capacity: 2,
          images: [
            "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800",
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
          ],
          amenities: ["Garden View", "King Bed", "Mosquito Net", "Organic Toiletries"],
        },
      ],
    },
    {
      name: "London Royal Heritage Hotel",
      description: "Step into British elegance in Mayfair with timeless luxury and impeccable service.",
      address: "42 Park Lane, Mayfair",
      city: "London",
      country: "United Kingdom",
      rating: 4.6,
      images: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      ],
      amenities: ["Afternoon Tea", "Spa", "Fitness Center", "Restaurant", "Bar", "Concierge"],
      rooms: [
        {
          name: "Classic British Room",
          description: "Traditionally appointed room with views of Hyde Park.",
          roomType: "DOUBLE" as const,
          pricePerNight: 449,
          capacity: 2,
          images: [
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          ],
          amenities: ["Park View", "King Bed", "Tea Making Facilities", "Bathrobes"],
        },
        {
          name: "Royal Suite",
          description: "Experience aristocratic luxury in our signature Royal Suite.",
          roomType: "SUITE" as const,
          pricePerNight: 1199,
          capacity: 3,
          images: [
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          ],
          amenities: ["Park View", "Living Room", "Dining Area", "Butler Service"],
        },
        {
          name: "Single Executive",
          description: "Compact yet comfortable room perfect for business travelers.",
          roomType: "SINGLE" as const,
          pricePerNight: 299,
          capacity: 1,
          images: [
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
          ],
          amenities: ["Work Desk", "Wi-Fi", "Coffee Machine", "City View"],
        },
      ],
    },
    {
      name: "Maldives Crystal Waters Resort",
      description: "Escape to paradise with overwater villas offering direct access to pristine turquoise waters and unmatched privacy.",
      address: "North Malé Atoll",
      city: "Malé",
      country: "Maldives",
      rating: 5.0,
      images: [
        "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800",
        "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
        "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800",
        "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=800",
      ],
      amenities: ["Overwater Villas", "Private Beach", "Diving Center", "Spa", "Multiple Restaurants", "Water Sports"],
      rooms: [
        {
          name: "Overwater Villa",
          description: "Iconic overwater villa with glass floor panels and direct lagoon access.",
          roomType: "SUITE" as const,
          pricePerNight: 1299,
          capacity: 2,
          images: [
            "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800",
            "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
            "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800",
          ],
          amenities: ["Glass Floor", "Lagoon Access", "Private Deck", "Outdoor Shower"],
        },
        {
          name: "Beach Villa",
          description: "Beachfront villa with private pool and direct beach access.",
          roomType: "SUITE" as const,
          pricePerNight: 999,
          capacity: 3,
          images: [
            "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
            "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800",
            "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=800",
          ],
          amenities: ["Beach Access", "Private Pool", "Sun Deck", "Outdoor Bathtub"],
        },
        {
          name: "Presidential Water Suite",
          description: "The ultimate luxury with two bedrooms, infinity pool, and dedicated butler.",
          roomType: "PENTHOUSE" as const,
          pricePerNight: 3999,
          capacity: 4,
          images: [
            "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
            "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800",
            "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
            "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800",
          ],
          amenities: ["Two Bedrooms", "Infinity Pool", "Butler Service", "Private Chef"],
        },
      ],
    },
    {
      name: "Sydney Harbour Grand",
      description: "Wake up to views of the Sydney Opera House and Harbour Bridge at Australia's premier luxury destination.",
      address: "1 Circular Quay",
      city: "Sydney",
      country: "Australia",
      rating: 4.7,
      images: [
        "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800",
        "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      ],
      amenities: ["Harbour Views", "Rooftop Pool", "Spa", "Fine Dining", "Fitness Center", "Bar"],
      rooms: [
        {
          name: "Opera House View Room",
          description: "Stunning room with direct views of the iconic Sydney Opera House.",
          roomType: "DOUBLE" as const,
          pricePerNight: 549,
          capacity: 2,
          images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
          ],
          amenities: ["Opera House View", "King Bed", "Balcony", "Mini Bar"],
        },
        {
          name: "Harbour Bridge Suite",
          description: "Luxurious suite overlooking the magnificent Harbour Bridge.",
          roomType: "SUITE" as const,
          pricePerNight: 899,
          capacity: 3,
          images: [
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          ],
          amenities: ["Bridge View", "Living Area", "Dining Table", "Butler Service"],
        },
      ],
    },
    {
      name: "Barcelona Gothic Quarter Hotel",
      description: "Immerse yourself in Catalan culture at our boutique hotel in Barcelona's historic Gothic Quarter.",
      address: "Carrer de Ferran 42",
      city: "Barcelona",
      country: "Spain",
      rating: 4.5,
      images: [
        "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800",
        "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?w=800",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
      ],
      amenities: ["Rooftop Terrace", "Tapas Bar", "Concierge", "Bike Rental", "Wine Cellar"],
      rooms: [
        {
          name: "Gothic Quarter Room",
          description: "Charming room in a historic building with original architectural details.",
          roomType: "DOUBLE" as const,
          pricePerNight: 279,
          capacity: 2,
          images: [
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          ],
          amenities: ["Historic Building", "Queen Bed", "Air Conditioning", "Wi-Fi"],
        },
        {
          name: "La Rambla Suite",
          description: "Spacious suite with balcony overlooking the famous La Rambla.",
          roomType: "SUITE" as const,
          pricePerNight: 499,
          capacity: 3,
          images: [
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          ],
          amenities: ["La Rambla View", "Balcony", "Living Area", "Complimentary Cava"],
        },
        {
          name: "Cozy Single",
          description: "Perfect for solo travelers exploring Barcelona.",
          roomType: "SINGLE" as const,
          pricePerNight: 149,
          capacity: 1,
          images: [
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
          ],
          amenities: ["Single Bed", "Desk", "Wi-Fi", "City Map"],
        },
      ],
    },
    {
      name: "Reykjavik Northern Lights Hotel",
      description: "Your gateway to Iceland's natural wonders. Watch the Northern Lights from your room.",
      address: "Laugavegur 105",
      city: "Reykjavik",
      country: "Iceland",
      rating: 4.6,
      images: [
        "https://images.unsplash.com/photo-1520681279154-51b3fb4ea0f7?w=800",
        "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800",
        "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800",
      ],
      amenities: ["Aurora Alerts", "Hot Tub", "Sauna", "Restaurant", "Tour Desk", "Heated Floors"],
      rooms: [
        {
          name: "Aurora View Room",
          description: "Room with large windows perfect for Northern Lights viewing.",
          roomType: "DOUBLE" as const,
          pricePerNight: 379,
          capacity: 2,
          images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
          ],
          amenities: ["Large Windows", "King Bed", "Blackout Curtains", "Heated Floors"],
        },
        {
          name: "Glacier Suite",
          description: "Luxurious suite inspired by Iceland's stunning glaciers.",
          roomType: "SUITE" as const,
          pricePerNight: 699,
          capacity: 3,
          images: [
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          ],
          amenities: ["Panoramic Windows", "Living Room", "Private Hot Tub", "Fireplace"],
        },
      ],
    },
    {
      name: "Cape Town Waterfront Hotel",
      description: "Experience the vibrant V&A Waterfront with Table Mountain as your backdrop.",
      address: "V&A Waterfront",
      city: "Cape Town",
      country: "South Africa",
      rating: 4.8,
      images: [
        "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800",
        "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=800",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      ],
      amenities: ["Mountain Views", "Pool", "Spa", "Wine Bar", "Restaurant", "Safari Desk"],
      rooms: [
        {
          name: "Table Mountain View Room",
          description: "Wake up to the majestic Table Mountain every morning.",
          roomType: "DOUBLE" as const,
          pricePerNight: 329,
          capacity: 2,
          images: [
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          ],
          amenities: ["Mountain View", "King Bed", "Balcony", "Mini Bar"],
        },
        {
          name: "Waterfront Suite",
          description: "Elegant suite overlooking the bustling V&A Waterfront.",
          roomType: "SUITE" as const,
          pricePerNight: 599,
          capacity: 3,
          images: [
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          ],
          amenities: ["Waterfront View", "Living Area", "Bathtub", "Welcome Wine"],
        },
        {
          name: "Penthouse Safari Suite",
          description: "Ultimate luxury with 360-degree views and African-inspired decor.",
          roomType: "PENTHOUSE" as const,
          pricePerNight: 1499,
          capacity: 4,
          images: [
            "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
          ],
          amenities: ["360° Views", "Private Terrace", "Plunge Pool", "Safari Concierge"],
        },
      ],
    },
    {
      name: "Vancouver Mountain Lodge",
      description: "Where the mountains meet the sea. Easy access to world-class skiing and hiking.",
      address: "1200 Robson Street",
      city: "Vancouver",
      country: "Canada",
      rating: 4.5,
      images: [
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      ],
      amenities: ["Ski Shuttle", "Hot Tub", "Fireplace Lounge", "Restaurant", "Bike Storage", "Kayak Rental"],
      rooms: [
        {
          name: "Mountain Twin",
          description: "Comfortable twin room with stunning North Shore mountain views.",
          roomType: "TWIN" as const,
          pricePerNight: 289,
          capacity: 2,
          images: [
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
            "https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800",
          ],
          amenities: ["Mountain View", "Twin Beds", "Fireplace", "Coffee Maker"],
        },
        {
          name: "Ocean & Mountain Suite",
          description: "Rare views of both the Pacific Ocean and coastal mountains.",
          roomType: "SUITE" as const,
          pricePerNight: 649,
          capacity: 4,
          images: [
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          ],
          amenities: ["Dual Views", "Two Bedrooms", "Full Kitchen", "Dining Area"],
        },
        {
          name: "Cozy Cabin Room",
          description: "Intimate single room with authentic lodge atmosphere.",
          roomType: "SINGLE" as const,
          pricePerNight: 179,
          capacity: 1,
          images: [
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
          ],
          amenities: ["Wood Paneling", "Queen Bed", "Reading Nook", "Fireplace"],
        },
      ],
    },
  ];

  // Create all hotels with their rooms
  for (const hotelData of hotels) {
    const { rooms, ...hotel } = hotelData;
    await prisma.hotel.create({
      data: {
        ...hotel,
        ownerId: owner.id,
        rooms: {
          create: rooms,
        },
      },
    });
  }

  console.log("🏨 Created hotels with rooms");

  // Create sample reservations
  const allRooms = await prisma.room.findMany();
  const today = new Date();

  await prisma.reservation.create({
    data: {
      checkInDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
      checkOutDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
      totalPrice: allRooms[0]!.pricePerNight * 3,
      guestCount: 2,
      status: "CONFIRMED",
      specialRequests: "Late check-in requested (around 10 PM)",
      userId: client.id,
      roomId: allRooms[0]!.id,
    },
  });

  await prisma.reservation.create({
    data: {
      checkInDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
      checkOutDate: new Date(today.getTime() + 17 * 24 * 60 * 60 * 1000),
      totalPrice: allRooms[5]!.pricePerNight * 3,
      guestCount: 1,
      status: "PENDING",
      specialRequests: "Vegetarian breakfast preferred",
      userId: client.id,
      roomId: allRooms[5]!.id,
    },
  });

  console.log("📅 Created sample reservations");

  console.log("\n✅ Seed completed successfully!");
  console.log("\n📋 Test accounts created:");
  console.log("   Hotel Owner:");
  console.log("   - owner@luxstay.com / 123123123");
  console.log("   Client:");
  console.log("   - client@example.com / 123123123");
  console.log(`\n🏨 Created ${hotels.length} hotels with multiple rooms each`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
