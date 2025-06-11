import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const FloatingMenu: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [location] = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { href: '/', label: 'Sanctuarium', icon: Home },
    { href: '/cursos', label: 'Doctrina', icon: Book },
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
    <div className="fixed top-20 right-4 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-black/90 backdrop-blur-lg border-amber-500/30 text-amber-300 hover:bg-amber-500/10 px-3 py-2 text-xs md:text-sm"
          >
            <Menu className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Menu</span>
            <span className="sm:hidden">Menu</span>
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-64 sm:w-72 md:w-80 max-h-[80vh] overflow-y-auto bg-black/95 backdrop-blur-lg border-amber-500/30 text-white" 
          side="left" 
          align="start"
          sideOffset={8}
          alignOffset={-4}
          avoidCollisions={true}
          collisionBoundary={document?.documentElement}
        >
          <div className="space-y-3">
            <div className="text-center">
              <h3 className="text-sm md:text-lg font-cinzel-decorative text-amber-400 mb-1">
                Navegação do Templo
              </h3>
              <p className="text-xs md:text-sm text-gray-400">
                Explore os domínios
              </p>
            </div>

            {/* Navigation Grid */}
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.href);
                
                return (
                  <Link key={item.href} href={item.href}>
                    <Card
                      className={`cursor-pointer transition-all duration-300 border-2 ${
                        isActive
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-gray-700 bg-gray-900/50 hover:border-amber-500/50 hover:bg-amber-500/5'
                      }`}
                    >
                      <CardContent className="p-2 md:p-3 text-center">
                        <Icon className={`w-4 h-4 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 ${
                          isActive ? 'text-amber-400' : 'text-gray-400'
                        }`} />
                        <h4 className={`text-xs md:text-sm font-cinzel font-semibold mb-1 ${
                          isActive ? 'text-amber-300' : 'text-gray-300'
                        }`}>
                          {item.label}
                        </h4>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="border-t border-amber-800/20 pt-3">
              {isAuthenticated && user ? (
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <Link href="/profile">
                    <Card className="cursor-pointer transition-all duration-300 border-2 border-gray-700 bg-gray-900/50 hover:border-amber-500/50 hover:bg-amber-500/5">
                      <CardContent className="p-2 md:p-3 text-center">
                        <User className="w-4 h-4 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-gray-400" />
                        <h4 className="text-xs md:text-sm font-cinzel font-semibold mb-1 text-gray-300">
                          Perfil
                        </h4>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  {user.is_admin && (
                    <Link href="/admin">
                      <Card className="cursor-pointer transition-all duration-300 border-2 border-gray-700 bg-gray-900/50 hover:border-amber-500/50 hover:bg-amber-500/5">
                        <CardContent className="p-2 md:p-3 text-center">
                          <Shield className="w-4 h-4 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-gray-400" />
                          <h4 className="text-xs md:text-sm font-cinzel font-semibold mb-1 text-gray-300">
                            Admin
                          </h4>
                        </CardContent>
                      </Card>
                    </Link>
                  )}
                  
                  <Card 
                    onClick={handleLogout}
                    className="cursor-pointer transition-all duration-300 border-2 border-red-700/50 bg-red-900/20 hover:border-red-500/50 hover:bg-red-500/10"
                  >
                    <CardContent className="p-2 md:p-3 text-center">
                      <LogOut className="w-4 h-4 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-red-400" />
                      <h4 className="text-xs md:text-sm font-cinzel font-semibold mb-1 text-red-300">
                        Sair
                      </h4>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <Link href="/login">
                    <Card className="cursor-pointer transition-all duration-300 border-2 border-gray-700 bg-gray-900/50 hover:border-amber-500/50 hover:bg-amber-500/5">
                      <CardContent className="p-2 md:p-3 text-center">
                        <LogIn className="w-4 h-4 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-gray-400" />
                        <h4 className="text-xs md:text-sm font-cinzel font-semibold mb-1 text-gray-300">
                          Entrar
                        </h4>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/register">
                    <Card className="cursor-pointer transition-all duration-300 border-2 border-amber-700/50 bg-gradient-to-r from-amber-600/20 to-red-600/20 hover:from-amber-600/30 hover:to-red-600/30">
                      <CardContent className="p-2 md:p-3 text-center">
                        <UserPlus className="w-4 h-4 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-amber-400" />
                        <h4 className="text-xs md:text-sm font-cinzel font-semibold mb-1 text-amber-300">
                          Registrar
                        </h4>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FloatingMenu;