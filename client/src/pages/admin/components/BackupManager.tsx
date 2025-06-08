import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Download } from "lucide-react";

export default function BackupManager() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Backup Manager</h2>
          <p className="text-muted-foreground">Create and restore site backups</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Database className="w-4 h-4" />
          <span>Create Backup</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Available Backups</span>
          </CardTitle>
          <CardDescription>
            No backups have been created yet
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Backups Available</h3>
          <p className="text-muted-foreground mb-4">
            Create your first backup to protect your data
          </p>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Create First Backup
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}