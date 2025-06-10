import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  LogIn,
  User, 
  UserPlus,
  Settings, 
  Home,
  Book,
  Scroll,
  Eye,
  Feather,
  Library,
  Shield,
  Menu,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { href: '/', label: 'Sanctuarium', icon: Home },
    { href: '/grimoires', label: 'Grimorium', icon: Scroll },
    { href: '/oraculo', label: 'Oraculum', icon: Eye },
    { href: '/gnosis', label: 'Gnosis', icon: Book },
    { href: '/liber-prohibitus', label: 'Liber Prohibitus', icon: Shield },
    { href: '/voz-da-pluma', label: 'Vox Pluma', icon: Feather },
    { href: '/bibliotheca', label: 'Bibliotheca', icon: Library },
  ];

  const isActivePath = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-800/20 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-center">
          {/* Centered Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 relative flex items-center justify-center">
                {/* Rotating seal logo */}
                <div className="absolute inset-0 animate-spin-slow">
                  <img 
                    src="/seal.png" 
                    alt="Selo do Templo do Abismo" 
                    className="w-full h-full object-contain opacity-90"
                  />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent font-['Cinzel_Decorative'] floating-title-slow">
                Templo do Abismo
              </span>
              <div className="w-10 h-10 relative flex items-center justify-center">
                <div className="absolute inset-0 animate-spin-slow-reverse">
                  <img 
                    src="/seal.png" 
                    alt="Selo do Templo do Abismo" 
                    className="w-full h-full object-contain opacity-90"
                  />
                </div>
              </div>
            </div>
          </Link>
        </div>
    </header>
  );
};

export default Header;