import { useNavigate } from "react-router";
import { useAuth } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { ArrowLeft, User, Mail, Shield, Calendar } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) {
    navigate("/login");
    return null;
  }

  const roleLabels: Record<string, string> = {
    CLIENT: "Guest",
    HOTEL_OWNER: "Hotel Owner",
    ADMIN: "Administrator",
  };

  const fullName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.email;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{fullName}</h2>
              <p className="text-muted-foreground">{roleLabels[user.role] || user.role}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Account Type</p>
                <p className="font-medium">{roleLabels[user.role] || user.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              {(user.role === "HOTEL_OWNER" || user.role === "ADMIN") && (
                <Button onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate("/reservations")}>
                My Reservations
              </Button>
              <Button variant="outline" onClick={() => navigate("/hotels")}>
                Browse Hotels
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <Button variant="destructive" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function meta() {
  return [
    { title: "Profile - LuxStay" },
    { name: "description", content: "View and manage your profile" },
  ];
}
