import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";

export default function UserManager() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Manager</h2>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button className="flex items-center space-x-2">
          <UserPlus className="w-4 h-4" />
          <span>Add User</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>User Accounts</span>
          </CardTitle>
          <CardDescription>
            Currently showing 1 active admin account
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Admin Account Active</h3>
          <p className="text-muted-foreground mb-4">
            Only the administrative account is currently configured
          </p>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}