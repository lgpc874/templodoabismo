import { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import SiteConfig from "./components/SiteConfig";
import ContentManager from "./components/ContentManager";
import DesignEditor from "./components/DesignEditor";
import MediaLibrary from "./components/MediaLibrary";
import BackupManager from "./components/BackupManager";
import UserManager from "./components/UserManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
type AdminSection = 
  | "dashboard"
  | "site-config"
  | "content-manager"
  | "design-editor"
  | "media-library"
  | "backup-manager"
  | "user-manager";

export default function AdminPanel() {
  const { user, login, logout, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginData.username, loginData.password);
      toast({
        title: "Login successful",
        description: "Welcome to Magus Secretum admin panel",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const handleSaveChanges = () => {
    toast({
      title: "Changes saved",
      description: "All configuration changes have been saved successfully",
    });
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "site-config":
        return <SiteConfig />;
      case "content-manager":
        return <ContentManager />;
      case "design-editor":
        return <DesignEditor />;
      case "media-library":
        return <MediaLibrary />;
      case "backup-manager":
        return <BackupManager />;
      case "user-manager":
        return <UserManager />;
      default:
        return <Dashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Magus Secretum</CardTitle>
            <CardDescription>Admin Panel Access Required</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Access Admin Panel"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="admin-panel flex h-screen bg-slate-50 text-foreground">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        user={user}
        onLogout={logout}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-slate-900 capitalize">
                {activeSection.replace("-", " ")}
              </h2>
              <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-subtle"></div>
                <span>Auto-save enabled</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Live Preview</span>
              </Button>
              
              <Button
                size="sm"
                onClick={handleSaveChanges}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto config-panel">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Live Preview Modal */}
      {isPreviewMode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-5/6 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold">Live Preview</h3>
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPreviewMode(false)}
                >
                  ×
                </Button>
              </div>
            </div>
            <div className="flex-1 p-4">
              <iframe
                src="/"
                className="w-full h-full border border-slate-200 rounded-lg"
                title="Live Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
