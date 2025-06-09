import { useState } from "react";
import { Link } from "wouter";
import { Eye, Lock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface MysticalGateProps {
  title: string;
  description: string;
  mysticText: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export default function MysticalGate({ title, description, mysticText, children, icon }: MysticalGateProps) {
  const { user } = useAuth();
  const [showRitual, setShowRitual] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Mystical background effects */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-950/20 via-black to-red-950/20"></div>
          <div className="mystical-particles"></div>
        </div>

        {/* Central seal */}
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
          <div className="rotating-seal w-64 h-64 opacity-10">
            <img 
              src="/seal.png" 
              alt="Selo do Templo" 
              className="w-full h-full object-contain filter drop-shadow-lg"
            />
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-2xl glass-effect p-8 border border-red-900/30">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center">
                {icon || <Eye className="w-8 h-8 text-red-400" />}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-cinzel font-bold mb-6 text-red-400">
              {title}
            </h1>

            {/* Description */}
            <p className="text-gray-300 mb-8 leading-relaxed font-crimson">
              {description}
            </p>

            {/* Mystic Text */}
            <div className="border-t border-b border-red-900/30 py-6 mb-8">
              <p className="text-red-300 italic font-cinzel text-lg">
                "{mysticText}"
              </p>
            </div>

            {/* Gate locked message */}
            <div className="flex items-center justify-center mb-6 text-amber-400">
              <Lock className="w-5 h-5 mr-2" />
              <span className="font-crimson">Portal Selado - Apenas Cadastrados</span>
            </div>

            {/* Enter button */}
            <div className="space-y-4">
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white font-cinzel">
                  <Flame className="w-4 h-4 mr-2" />
                  Iniciar Ritual de Acesso
                </Button>
              </Link>
              
              <p className="text-sm text-gray-400">
                Apenas aqueles que se registraram no templo podem adentrar estes domínios sagrados.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated, show the content
  return (
    <div className="min-h-screen bg-black">
      {children}
    </div>
  );
}