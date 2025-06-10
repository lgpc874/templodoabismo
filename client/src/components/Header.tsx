import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  User, 
  Settings, 
  Home,
  Book,
  Scroll,
  Eye,
  Feather,
  Library,
  Shield
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

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { href: '/', label: 'Sanctuarium', icon: Home },
    { href: '/courses', label: 'Disciplinae', icon: Book },
    { href: '/grimoires', label: 'Grimórios', icon: Scroll },
    { href: '/oraculo', label: 'Oráculo', icon: Eye },
    { href: '/voz-da-pluma', label: 'Voz da Pluma', icon: Feather },
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
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-8 h-8 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-red-500 to-purple-600 rounded-full animate-pulse"></div>
                <div className="absolute inset-1 bg-black rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent">
                Templo do Abismo
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                      isActivePath(item.href)
                        ? 'bg-amber-900/30 text-amber-400 shadow-md'
                        : 'text-gray-300 hover:text-amber-400 hover:bg-amber-900/20'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-2 text-gray-300 hover:text-amber-400 hover:bg-amber-900/20"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:block">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-gray-900 border-amber-800/20 text-gray-100"
                >
                  <DropdownMenuItem className="hover:bg-amber-900/20 hover:text-amber-400">
                    <User className="w-4 h-4 mr-2" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-amber-900/20 hover:text-amber-400">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </DropdownMenuItem>
                  {user.is_admin && (
                    <>
                      <DropdownMenuSeparator className="bg-amber-800/20" />
                      <DropdownMenuItem className="hover:bg-amber-900/20 hover:text-amber-400">
                        <Link href="/admin" className="flex items-center w-full">
                          <Shield className="w-4 h-4 mr-2" />
                          Painel Admin
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-amber-800/20" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="hover:bg-red-900/20 hover:text-red-400"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button 
                    variant="ghost" 
                    className="text-gray-300 hover:text-amber-400 hover:bg-amber-900/20"
                  >
                    Entrar
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white"
                  >
                    Registrar
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-amber-400 hover:bg-amber-900/20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;