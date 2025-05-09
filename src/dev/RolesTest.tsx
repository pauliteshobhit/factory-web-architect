import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function RolesTest() {
  const { user, role, isAdmin, loading, refreshRole } = useAuth();
  const { toast } = useToast();

  const handleRefreshRole = async () => {
    try {
      await refreshRole();
      toast({
        title: "✅ Role Refreshed",
        description: "User role has been updated successfully.",
      });
    } catch (err: any) {
      toast({
        title: "❌ Error",
        description: err.message || "Failed to refresh role",
        variant: "destructive",
      });
    }
  };

  const handleAdminUploadClick = () => {
    if (!isAdmin) {
      toast({
        title: "⚠️ Access Denied",
        description: "You must be an admin to access the upload page.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Loading User Data</CardTitle>
            <CardDescription>Please wait while we fetch your information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container max-w-2xl py-8">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Not Authenticated</AlertTitle>
          <AlertDescription>
            Please log in to view your role information.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>User Role Information</CardTitle>
          <CardDescription>
            View and test your current role permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">User Details:</span>
            </div>
            <div className="pl-6 space-y-1">
              <p>Email: {user.email}</p>
              <p>User ID: {user.id}</p>
              <p>Role: {role || "user"}</p>
              <p>Admin Access: {isAdmin ? "✅ Yes" : "❌ No"}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleRefreshRole}>
              Refresh Role
            </Button>
            <Link to="/admin/upload">
              <Button
                variant={isAdmin ? "default" : "secondary"}
                disabled={!isAdmin}
                onClick={handleAdminUploadClick}
              >
                Go to Admin Upload
              </Button>
            </Link>
          </div>

          {!isAdmin && (
            <Alert>
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Limited Access</AlertTitle>
              <AlertDescription>
                Your current role ({role || "user"}) does not have admin privileges.
                Contact an administrator if you need elevated access.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 