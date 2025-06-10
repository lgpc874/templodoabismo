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
          {/* Desktop Logo */}
          <Link href="/" className="hidden md:block">
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
            </div>
          </Link>

          {/* Mobile Centered Logo */}
          <Link href="/" className="md:hidden flex items-center justify-center flex-1">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 relative flex items-center justify-center">
                <div className="absolute inset-0 animate-spin-slow">
                  <img 
                    src="/seal.png" 
                    alt="Selo do Templo do Abismo" 
                    className="w-full h-full object-contain opacity-90"
                  />
                </div>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent font-['Cinzel_Decorative'] floating-title-slow">
                Templo do Abismo
              </span>
              <div className="w-8 h-8 relative flex items-center justify-center">
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
              <div className="hidden md:flex items-center space-x-2">
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
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-amber-800/20 bg-black/95 backdrop-blur">
            <div className="px-4 py-3 space-y-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <button
                      className={`flex items-center space-x-3 w-full px-3 py-3 rounded-md transition-all duration-200 ${
                        isActivePath(item.href)
                          ? 'bg-amber-900/30 text-amber-400 shadow-md'
                          : 'text-gray-300 hover:text-amber-400 hover:bg-amber-900/20'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-base font-medium">{item.label}</span>
                    </button>
                  </Link>
                );
              })}
              
              {/* Mobile User Menu */}
              {isAuthenticated && user ? (
                <div className="pt-3 border-t border-amber-800/20 space-y-2">
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="flex items-center space-x-3 w-full px-3 py-3 rounded-md text-gray-300 hover:text-amber-400 hover:bg-amber-900/20 transition-all duration-200">
                      <User className="w-5 h-5" />
                      <span className="text-base font-medium">Perfil</span>
                    </button>
                  </Link>
                  <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="flex items-center space-x-3 w-full px-3 py-3 rounded-md text-gray-300 hover:text-amber-400 hover:bg-amber-900/20 transition-all duration-200">
                      <Settings className="w-5 h-5" />
                      <span className="text-base font-medium">Configurações</span>
                    </button>
                  </Link>
                  {user.is_admin && (
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="flex items-center space-x-3 w-full px-3 py-3 rounded-md text-gray-300 hover:text-amber-400 hover:bg-amber-900/20 transition-all duration-200">
                        <Shield className="w-5 h-5" />
                        <span className="text-base font-medium">Painel Admin</span>
                      </button>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-3 py-3 rounded-md text-gray-300 hover:text-red-400 hover:bg-red-900/20 transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-base font-medium">Sair</span>
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-amber-800/20 space-y-2">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="flex items-center space-x-3 w-full px-3 py-3 rounded-md text-gray-300 hover:text-amber-400 hover:bg-amber-900/20 transition-all duration-200">
                      <User className="w-5 h-5" />
                      <span className="text-base font-medium">Entrar</span>
                    </button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="flex items-center space-x-3 w-full px-3 py-3 rounded-md text-gray-300 hover:text-amber-400 hover:bg-amber-900/20 transition-all duration-200">
                      <User className="w-5 h-5" />
                      <span className="text-base font-medium">Registrar</span>
                    </button>
                  </Link>
                </div>
              )}
              
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;