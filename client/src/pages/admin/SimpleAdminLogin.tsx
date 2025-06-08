import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import Dashboard from "./components/Dashboard";
import SiteConfig from "./components/SiteConfig";
import ContentManager from "./components/ContentManager";
import DesignEditor from "./components/DesignEditor";
import MediaLibrary from "./components/MediaLibrary";
import BackupManager from "./components/BackupManager";
import UserManager from "./components/UserManager";
import Sidebar from "./components/Sidebar";

type AdminSection = 
  | "dashboard"
  | "site-config"
  | "content-manager"
  | "design-editor"
  | "media-library"
  | "backup-manager"
  | "user-manager";

const mockUser = {
  id: 1,
  username: "admin",
  email: "admin@templo.com",
  role: "admin"
};

export default function SimpleAdminLogin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.username === "admin" && loginData.password === "admin123") {
      setIsLoggedIn(true);
    } else {
      alert("Credenciais inválidas. Use: admin / admin123");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginData({ username: "", password: "" });
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

  const handleSaveChanges = () => {
    alert("Configurações salvas com sucesso!");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Magus Secretum</CardTitle>
            <CardDescription>Painel de Administração</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="admin"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="admin123"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Acessar Painel
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Credenciais de teste:</p>
              <p>Usuário: <strong>admin</strong></p>
              <p>Senha: <strong>admin123</strong></p>
            </div>
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
        user={mockUser}
        onLogout={handleLogout}
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
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span>Sistema ativo</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center space-x-2"
              >
                <span>Pré-visualizar</span>
              </Button>
              
              <Button
                size="sm"
                onClick={handleSaveChanges}
                className="flex items-center space-x-2"
              >
                <span>Salvar</span>
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
              <h3 className="text-lg font-semibold">Pré-visualização</h3>
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
                title="Pré-visualização"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}