import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ShieldAlert, User, Loader2, CheckCircle2, XCircle, Shield, Upload, Database } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface RoleTestResult {
  success: boolean;
  message: string;
  details?: any;
}

export default function RolesTestSuite() {
  const { user, loading, isAdmin, roleLoading, refreshRole, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [simulateDelay, setSimulateDelay] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [testResults, setTestResults] = useState<RoleTestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const handleRefreshRole = async () => {
    if (!user) return;
    setIsRefreshing(true);
    try {
      await refreshRole(user.id);
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
    } finally {
      setIsRefreshing(false);
    }
  };

  const runRoleTests = async () => {
    if (!user) return;
    setIsTesting(true);
    const results: RoleTestResult[] = [];

    try {
      // Test 1: Check user_roles table
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      results.push({
        success: !roleError && roleData?.role === "admin",
        message: roleError ? "Failed to fetch role from database" : "Role check successful",
        details: roleData,
      });

      // Test 2: Check projects table access
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("id")
        .limit(1);

      results.push({
        success: !projectError,
        message: projectError ? "Failed to access projects table" : "Projects table access successful",
        details: projectError,
      });

      // Test 3: Try to insert a test project
      const testProject = {
        title: "Test Project",
        description: "This is a test project",
        category: "Other",
        user_id: user.id,
        email: user.email,
        created_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabase
        .from("projects")
        .insert(testProject);

      results.push({
        success: !insertError,
        message: insertError ? "Failed to insert test project" : "Project insertion successful",
        details: insertError,
      });

      setTestResults(results);

      // Show summary toast
      const allPassed = results.every(r => r.success);
      toast({
        title: allPassed ? "✅ All Tests Passed" : "⚠️ Some Tests Failed",
        description: `Completed ${results.length} tests`,
        variant: allPassed ? "default" : "destructive",
      });

    } catch (err: any) {
      console.error("Test suite error:", err);
      toast({
        title: "❌ Test Suite Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleAdminUploadClick = () => {
    if (!isAdmin) {
      toast({
        title: "⚠️ Access Denied",
        description: "You must be an admin to access the upload page.",
        variant: "destructive",
      });
    } else {
      navigate("/admin/upload");
    }
  };

  const handleSimulateLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "👋 Logged Out",
        description: "Session cleared for testing purposes.",
      });
    } catch (err: any) {
      toast({
        title: "❌ Error",
        description: err.message || "Failed to simulate logout",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
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
          <CardTitle>Role Test Suite</CardTitle>
          <CardDescription>
            Test and verify user roles and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* User Info */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">User Information</h3>
              <div className="rounded-lg border p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">User ID:</span>
                    <code className="text-sm">{user?.id || "Not logged in"}</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Email:</span>
                    <code className="text-sm">{user?.email || "Not logged in"}</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Admin Status:</span>
                    {roleLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Badge variant={isAdmin ? "default" : "secondary"}>
                        {isAdmin ? (
                          <>
                            <Shield className="mr-1 h-3 w-3" />
                            Admin
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="mr-1 h-3 w-3" />
                            Not Admin
                          </>
                        )}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Test Results</h3>
                <div className="rounded-lg border p-4">
                  <div className="space-y-2">
                    {testResults.map((result, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">
                          Test {index + 1}: {result.message}
                        </span>
                        {result.success ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Actions</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={handleRefreshRole}
                  disabled={!user || roleLoading || isRefreshing}
                >
                  {roleLoading || isRefreshing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    "Refresh Role"
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={runRoleTests}
                  disabled={!user || isTesting}
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Run Role Tests
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={signOut}
                  disabled={!user}
                >
                  Simulate Logout
                </Button>

                <Link to="/admin/upload">
                  <Button
                    variant="default"
                    disabled={!isAdmin}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Go to Admin Upload
                  </Button>
                </Link>
              </div>
            </div>

            {/* Test Controls */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Switch
                  id="simulate-delay"
                  checked={simulateDelay}
                  onCheckedChange={setSimulateDelay}
                />
                <Label htmlFor="simulate-delay">Simulate Network Delay</Label>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Instructions</h3>
              <div className="rounded-lg border p-4">
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Use "Refresh Role" to manually check admin status</li>
                  <li>"Run Role Tests" to verify database access and permissions</li>
                  <li>"Go to Admin Upload" is only enabled for admins</li>
                  <li>Use "Simulate Logout" to test access denied states</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 