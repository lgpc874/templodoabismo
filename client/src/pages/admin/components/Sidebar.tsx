import { Crown, LayoutDashboard, Settings, FileText, Palette, Image, Users, Database, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminSection, User } from "../types";

interface SidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  user: User;
  onLogout: () => void;
}

export default function Sidebar({ activeSection, onSectionChange, user, onLogout }: SidebarProps) {
  const navItems = [
    { id: "dashboard" as AdminSection, label: "Dashboard", icon: LayoutDashboard },
    { id: "site-config" as AdminSection, label: "Site Configuration", icon: Settings },
    { id: "content" as AdminSection, label: "Content Management", icon: FileText },
    { id: "design" as AdminSection, label: "Design & Styling", icon: Palette },
    { id: "media" as AdminSection, label: "Media Library", icon: Image },
    { id: "users" as AdminSection, label: "User Management", icon: Users },
    { id: "backup" as AdminSection, label: "Backup & Restore", icon: Database },
  ];

  return (
    <div className="admin-sidebar w-80 bg-[var(--admin-sidebar-bg)] text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Crown className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Magus Secretum</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Site Status */}
      <div className="p-4 bg-emerald-900/20 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-300">Site Status</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-emerald-400">Live</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-slate-400">
          Last saved: 2 minutes ago
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`admin-nav-item w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                isActive
                  ? "active bg-primary text-white"
                  : "text-slate-300 hover:bg-[var(--admin-sidebar-hover)]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium">{user.username.slice(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-sm font-medium">{user.username}</p>
              <p className="text-xs text-slate-400">{user.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
