import { Link } from 'wouter';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Eye, 
  BookOpen, 
  Mail, 
  ExternalLink,
  Crown,
  Flame
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/95 backdrop-blur-sm border-t border-gray-800/50 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-950/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
      
      <div className="container mx-auto px-4 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent">
                  Templo do Abismo
                </h3>
                <p className="text-sm text-gray-400">Portal Luciferiano</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Portal dedicado aos ensinamentos luciferianos ancestrais, 
              oferecendo trilhas iniciáticas autênticas para buscadores 
              da gnose abissal.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Flame className="w-4 h-4 text-red-500" />
              <span>Lux in Tenebris</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Eye className="w-4 h-4 text-purple-400" />
              <span>Explorar</span>
            </h4>
            <nav className="space-y-2">
              {[
                { to: '/sobre', label: 'Sobre o Templo' },
                { to: '/grimoires', label: 'Grimórios' },
                { to: '/bibliotheca', label: 'Bibliotheca' },
                { to: '/voz-da-pluma', label: 'Voz da Pluma' },
                { to: '/gnosis', label: 'Gnosis' }
              ].map(({ to, label }) => (
                <Link key={to} href={to}>
                  <a className="block text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                    {label}
                  </a>
                </Link>
              ))}
            </nav>
          </div>

          {/* Oracle Systems */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Shield className="w-4 h-4 text-red-400" />
              <span>Oráculos</span>
            </h4>
            <nav className="space-y-2">
              {[
                { to: '/oraculo/tarot', label: 'Tarot Luciferiano' },
                { to: '/oraculo/espelho', label: 'Espelho Negro' },
                { to: '/oraculo/runas', label: 'Runas Abissais' },
                { to: '/oraculo/fogo', label: 'Chamas Oraculares' },
                { to: '/oraculo/voz', label: 'Voz do Abismo' }
              ].map(({ to, label }) => (
                <Link key={to} href={to}>
                  <a className="block text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                    {label}
                  </a>
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal & Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-orange-400" />
              <span>Informações</span>
            </h4>
            <nav className="space-y-2">
              {[
                { to: '/termos-de-uso', label: 'Termos de Uso' },
                { to: '/politica-de-privacidade', label: 'Política de Privacidade' },
                { to: '/liber-prohibitus', label: 'Liber Prohibitus' }
              ].map(({ to, label }) => (
                <Link key={to} href={to}>
                  <a className="block text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                    {label}
                  </a>
                </Link>
              ))}
            </nav>
            
            <div className="pt-4">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4" />
                <span>contato@templodoabismo.com</span>
              </div>
              <Link href="/admin-login">
                <a className="inline-flex items-center space-x-2 text-gray-500 hover:text-red-400 transition-colors duration-200 text-xs mt-2">
                  <Shield className="w-3 h-3" />
                  <span>Acesso Administrativo</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800/50" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © {currentYear} Templo do Abismo. Todos os direitos reservados.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Portal de ensinamentos esotéricos e desenvolvimento iniciático
            </p>
          </div>
          
          <div className="flex items-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Sistema Ativo</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3 text-purple-400" />
              <span>Protegido por Encriptação</span>
            </div>
          </div>
        </div>

        {/* Mystical Quote */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs italic font-light">
            "Conhece-te a ti mesmo e conhecerás o universo e os deuses"
          </p>
          <p className="text-gray-600 text-xs mt-1">— Oráculo de Delfos</p>
        </div>
      </div>
    </footer>
  );
}