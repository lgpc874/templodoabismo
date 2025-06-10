
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  GraduationCap,
  Gem, 
  Scroll,
  Library,
  Lock,
  User,
  LogOut,
  Coins
} from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const navigation = [
    { name: "Início", href: "/", icon: Home },
    { name: "Sobre", href: "/sobre", icon: BookOpen },
    { name: "Oráculos", href: "/oraculo", icon: Gem },
    { name: "Grimórios", href: "/grimorios", icon: Scroll },
    { name: "Voz da Pluma", href: "/voz-da-pluma", icon: Scroll },
    { name: "Bibliotheca", href: "/bibliotheca", icon: Library },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-sm border-b border-red-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <img 
                  src="https://i.postimg.cc/g20gqmdX/IMG-20250527-182235-1.png" 
                  alt="Templo do Abismo" 
                  className="h-8 w-8 animate-spin-slow"
                />
                <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-red-400 whitespace-nowrap">
                  <span className="hidden sm:inline">Templo do Abismo</span>
                  <span className="sm:hidden">Templo</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={location === item.href ? "destructive" : "ghost"}
                    className="text-red-200 hover:text-red-400 hover:bg-red-900/20"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>

                <div className="flex items-center space-x-2 text-red-200">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user?.username}</span>
                </div>
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="text-red-200 hover:text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="destructive" className="bg-red-800 hover:bg-red-700">
                  Entrar
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(!isOpen)}
              className="text-red-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-t border-red-900/30">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={location === item.href ? "destructive" : "ghost"}
                    className="w-full justify-start text-red-200 hover:text-red-400 hover:bg-red-900/20"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}

          </div>
        </div>
      )}
    </nav>
  );
}
