import { Link } from "react-router";
import { Hotel, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "~/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Hotel className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">LuxStay</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Discover and book the perfect stay at luxury hotels worldwide.
              Experience comfort and elegance with LuxStay.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/hotels" className="text-muted-foreground hover:text-foreground transition-colors">
                  Browse Hotels
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Find Rooms
                </Link>
              </li>
              <li>
                <Link to="/register?role=HOTEL_OWNER" className="text-muted-foreground hover:text-foreground transition-colors">
                  List Your Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Safety Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                support@luxstay.com
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                New York, NY 10001
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LuxStay. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
