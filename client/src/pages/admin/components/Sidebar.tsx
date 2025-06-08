import { Crown, LayoutDashboard, Settings, FileText, Palette, Image, Users, Database, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
export type AdminSection = 
  | "dashboard"
  | "site-config"
  | "content-manager"
  | "design-editor"
  | "media-library"
  | "backup-manager"
  | "user-manager";

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface SidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  user: User;
  onLogout: () => void;
}

export default function Sidebar({ activeSection, onSectionChange, user, onLogout }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "site-config", label: "Site Config", icon: Settings },
    { id: "content-manager", label: "Content Manager", icon: FileText },
    { id: "design-editor", label: "Design Editor", icon: Palette },
    { id: "media-library", label: "Media Library", icon: Image },
    { id: "user-manager", label: "User Manager", icon: Users },
    { id: "backup-manager", label: "Backup Manager", icon: Database },
  ] as const;

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Magus Secretum</h1>
            <p className="text-sm text-slate-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "default" : "ghost"}
            className={`w-full justify-start space-x-3 ${
              activeSection === item.id 
                ? "bg-white text-slate-900 hover:bg-slate-100" 
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
            onClick={() => onSectionChange(item.id as AdminSection)}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Button>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium">{user.username}</p>
            <p className="text-xs text-slate-400 capitalize">{user.role}</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          className="w-full justify-start space-x-3 text-slate-300 hover:text-white hover:bg-slate-800"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}