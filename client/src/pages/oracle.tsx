import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gem, Eye, Flame, Search, FileText } from "lucide-react";
import { Link } from "wouter";

const oracleTypes = [
  {
    id: 'tarot',
    name: 'Tarot Infernal',
    description: 'Consulte as cartas ancestrais que revelam os caminhos do destino',
    icon: Gem,
    color: 'from-purple-600 to-indigo-600',
    route: '/oraculo/tarot'
  },
  {
    id: 'mirror',
    name: 'Espelho do Abismo',
    description: 'Contemple as verdades ocultas em seu reflexo interior',
    icon: Search,
    color: 'from-blue-600 to-cyan-600',
    route: '/oraculo/espelho'
  },
  {
    id: 'runes',
    name: 'Runas Ancestrais',
    description: 'Decifre os símbolos nórdicos que sussurram sabedoria antiga',
    icon: FileText,
    color: 'from-amber-600 to-orange-600',
    route: '/oraculo/runas'
  },
  {
    id: 'fire',
    name: 'Chamas Reveladoras',
    description: 'Vislumbre visões nas labaredas do fogo sagrado',
    icon: Flame,
    color: 'from-red-600 to-rose-600',
    route: '/oraculo/fogo'
  },
  {
    id: 'voice',
    name: 'Voz do Abismo',
    description: 'Escute os sussurros das profundezas primordiais',
    icon: Eye,
    color: 'from-gray-600 to-slate-700',
    route: '/oraculo/voz'
  }
];

export default function Oracle() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-amber-500 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-orange-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse opacity-25"></div>
        <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-amber-600 rounded-full animate-pulse opacity-35"></div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center py-16">
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 mb-6 animate-title-float font-cinzel">
          Oráculo Ancestral
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-mystical-float">
          Adentre os mistérios primordiais e consulte as forças ancestrais que governam os véus da realidade
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {oracleTypes.map((oracle) => {
            const IconComponent = oracle.icon;
            return (
              <Card 
                key={oracle.id}
                className="cursor-pointer transition-all duration-300 hover:scale-105 border-2 border-gray-600 bg-gradient-to-b from-gray-900/50 to-black/50 hover:border-amber-600 backdrop-blur-sm"
              >
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${oracle.color} flex items-center justify-center animate-mystical-float`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-amber-200 animate-mystical-float font-cinzel">
                    {oracle.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400 mb-4">
                    {oracle.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link href={oracle.route}>
                    <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium">
                      Consultar Oráculo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Mystical Quote */}
      <div className="max-w-4xl mx-auto text-center py-8">
        <p className="text-gray-500 text-sm italic animate-mystical-float">
          "Nas trevas da ignorância, a luz do conhecimento brilha mais intensa"
        </p>
      </div>
    </div>
  );
}