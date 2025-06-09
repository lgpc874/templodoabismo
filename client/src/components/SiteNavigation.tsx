import { Link, useLocation } from 'wouter';
import { Menu, X, Home, Eye, GraduationCap, Scroll, Star, Moon, BookOpen, Feather, Skull } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

export default function SiteNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navigationItems = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/blog', label: 'Gnosis Abissal', icon: BookOpen },
    { href: '/oraculo', label: 'Oráculos Abissais', icon: Eye },
    { href: '/cursos', label: 'Academia Luciferiana', icon: GraduationCap },
    { href: '/grimorios', label: 'Biblioteca Abissal', icon: Scroll },
    { href: '/bibliotheca', label: 'Bibliotheca Secreta', icon: Star },
    { href: '/voz-da-pluma', label: 'Voz da Pluma', icon: Feather },
    { href: '/liber-prohibitus', label: 'Liber Prohibitus', icon: Skull },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed top-4 left-4 right-4 z-50">
        <div className="glass-effect border border-purple-900/50 rounded-lg px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-red-600 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm">TA</span>
                </div>
                <span className="text-amber-400 font-cinzel font-bold text-lg">
                  Templo do Abismo
                </span>
              </div>
            </Link>

            <div className="flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`
                        flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200
                        ${active 
                          ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' 
                          : 'text-gray-300 hover:text-amber-400 hover:bg-purple-900/20'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden xl:inline text-sm">{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center space-x-3">
              <Link href="/acesso">
                <Button 
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-black font-semibold"
                >
                  Acesso
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-purple-900/50">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-red-600 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-xs">TA</span>
                </div>
                <span className="text-amber-400 font-cinzel font-bold">
                  Templo do Abismo
                </span>
              </div>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-amber-400"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            
            <div className="fixed top-16 left-4 right-4 glass-effect border border-purple-900/50 rounded-lg p-4">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant="ghost"
                        className={`
                          w-full justify-start space-x-3 p-3 rounded-md transition-all duration-200
                          ${active 
                            ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' 
                            : 'text-gray-300 hover:text-amber-400 hover:bg-purple-900/20'
                          }
                        `}
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}
                
                <div className="pt-3 border-t border-purple-900/50">
                  <Link href="/acesso">
                    <Button 
                      className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold"
                      onClick={() => setIsOpen(false)}
                    >
                      Acesso ao Portal
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Spacer */}
      <div className="lg:hidden h-16" />
      {/* Desktop Spacer */}
      <div className="hidden lg:block h-20" />
    </>
  );
}