import { Link, useLocation } from 'wouter';
import { Menu, X, Home, Eye, GraduationCap, Scroll, Star, Moon, BookOpen, Feather, Skull } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

export default function SiteNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navigationItems = [
    { href: '/', label: 'Introitus', icon: Home },
    { href: '/blog', label: 'Gnosis Abyssos', icon: BookOpen },
    { href: '/oraculo', label: 'Oraculum Tenebrae', icon: Eye },
    { href: '/cursos', label: 'Academia Luciferiana', icon: GraduationCap },
    { href: '/grimorios', label: 'Bibliotheca Abyssos', icon: Scroll },
    { href: '/bibliotheca', label: 'Bibliotheca Secreta', icon: Star },
    { href: '/voz-da-pluma', label: 'Vox Plumae', icon: Feather },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed top-4 left-4 right-4 z-50">
        <div className="bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-lg px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <div className="w-10 h-10">
                  <img 
                    src="/seal.png" 
                    alt="Selo do Templo do Abismo" 
                    className="w-full h-full object-contain filter drop-shadow-lg"
                  />
                </div>
                <span className="text-amber-400 font-bold text-xl font-cinzel-decorative">
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
                  Accessus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-amber-500/20">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8">
                  <img 
                    src="/seal.png" 
                    alt="Selo do Templo do Abismo" 
                    className="w-full h-full object-contain filter drop-shadow-lg"
                  />
                </div>
                <span className="text-amber-400 font-bold font-cinzel-decorative">
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
            
            <div className="fixed top-16 left-4 right-4 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-lg p-4">
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
                      Accessus Portal
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