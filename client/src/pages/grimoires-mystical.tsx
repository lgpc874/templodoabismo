import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Download, Clock, Lock, Flame, Scroll, Shield, Crown } from "lucide-react";
import MysticalGate from "@/components/MysticalGate";
// import SiteNavigation from "@/components/SiteNavigation";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";

interface Grimoire {
  id: number;
  title: string;
  description: string;
  chapters: any;
  access_level: number;
  price_brl: number;
  rental_price_brl: number;
  rental_days: number;
  pdf_url?: string;
  cover_image?: string;
  can_read_online: boolean;
  can_download: boolean;
  is_active: boolean;
  created_at: string;
}

function GrimoiresContent() {
  const { user } = useAuth();
  const [selectedGrimoire, setSelectedGrimoire] = useState<Grimoire | null>(null);
  const queryClient = useQueryClient();

  const { data: grimoires = [], isLoading } = useQuery<Grimoire[]>({
    queryKey: ['/api/grimoires'],
  });

  const { data: userPurchases = [] } = useQuery({
    queryKey: ['/api/user/purchases'],
    enabled: !!user,
  });

  const { data: userRentals = [] } = useQuery({
    queryKey: ['/api/user/rentals'],
    enabled: !!user,
  });

  const rentMutation = useMutation({
    mutationFn: async (grimoireId: number) => {
      const response = await fetch(`/api/grimoires/${grimoireId}/rent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/rentals'] });
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: async (grimoireId: number) => {
      const response = await fetch(`/api/grimoires/${grimoireId}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/purchases'] });
    },
  });

  const getGrimoireAccess = (grimoire: Grimoire) => {
    const isPurchased = userPurchases.some((p: any) => p.grimoire_id === grimoire.id);
    const rental = userRentals.find((r: any) => r.grimoire_id === grimoire.id);
    const isRented = rental && new Date(rental.expires_at) > new Date();
    
    return { isPurchased, isRented, rental };
  };

  const getGrimoireTypeInfo = (grimoire: Grimoire) => {
    if (grimoire.access_level >= 7) {
      return {
        type: "Escrituras Proibidas",
        icon: <Crown className="w-6 h-6" />,
        bgClass: "from-purple-900 to-black",
        borderClass: "border-purple-500/50",
        textClass: "text-purple-300"
      };
    } else if (grimoire.access_level >= 4) {
      return {
        type: "Manuscritos Arcanos",
        icon: <Shield className="w-6 h-6" />,
        bgClass: "from-red-900 to-black",
        borderClass: "border-red-500/50",
        textClass: "text-red-300"
      };
    } else {
      return {
        type: "Textos Iniciáticos",
        icon: <Scroll className="w-6 h-6" />,
        bgClass: "from-amber-900 to-black",
        borderClass: "border-amber-500/50",
        textClass: "text-amber-300"
      };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="rotating-seal w-16 h-16 mx-auto mb-4">
            <Flame className="w-full h-full text-red-500" />
          </div>
          <p className="text-gray-400">Invocando os Grimórios Ancestrais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <SiteNavigation />
      
      {/* Mystical background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-amber-950/20 via-black to-red-950/20"></div>
        <div className="mystical-particles"></div>
      </div>

      {/* Central rotating seal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="rotating-seal w-96 h-96 opacity-10">
          <img 
            src="/seal.png" 
            alt="Selo dos Grimórios" 
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>
      </div>

      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-cinzel font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-500 to-purple-400">
              BIBLIOTHECA ABYSSOS
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Repositório das trevas onde dormem manuscritos amaldiçoados que sussurram segredos mortais. 
              Grimórios que pulsam com energia ctônica, invocações que podem rasgar o tecido da realidade 
              e escrituras que testam a sanidade daqueles que ousam contemplá-las.
            </p>
          </div>

          {/* Mystical Warning */}
          <div className="glass-effect p-6 border border-red-900/50 mb-8 text-center">
            <Flame className="w-8 h-8 mx-auto mb-3 text-red-500" />
            <p className="text-red-300 font-cinzel">
              "Que apenas os iniciados se aproximem destes textos sagrados, 
              pois o conhecimento sem sabedoria é a ruína dos imprudentes."
            </p>
          </div>

          {/* Grimoires Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grimoires.map((grimoire) => {
              const { isPurchased, isRented } = getGrimoireAccess(grimoire);
              const typeInfo = getGrimoireTypeInfo(grimoire);
              const hasAccess = isPurchased || isRented;

              return (
                <Card key={grimoire.id} className={`glass-effect ${typeInfo.borderClass} hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
                  {/* Cover Image */}
                  <div className={`h-48 bg-gradient-to-br ${typeInfo.bgClass} relative flex items-center justify-center`}>
                    {grimoire.cover_image ? (
                      <img 
                        src={grimoire.cover_image} 
                        alt={grimoire.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        {typeInfo.icon}
                        <div className={`text-xs ${typeInfo.textClass} mt-2 font-cinzel`}>
                          {typeInfo.type}
                        </div>
                      </div>
                    )}
                    
                    {/* Access Level Badge */}
                    <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-amber-400">
                      Nível {grimoire.access_level}
                    </div>

                    {/* Access Status */}
                    {hasAccess && (
                      <div className="absolute top-2 left-2 bg-green-900/70 px-2 py-1 rounded text-xs text-green-300">
                        {isPurchased ? "Possuído" : "Alugado"}
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className={`font-cinzel ${typeInfo.textClass} text-lg`}>
                      {grimoire.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                      {grimoire.description}
                    </p>

                    {/* Chapter Preview */}
                    {grimoire.chapters && Array.isArray(grimoire.chapters) && (
                      <div className="mb-4">
                        <div className="text-xs text-gray-500 mb-2">Capítulos Contidos:</div>
                        <div className="text-xs text-gray-400 space-y-1">
                          {grimoire.chapters.slice(0, 3).map((chapter: any, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
                              {chapter.title || `Capítulo ${index + 1}`}
                            </div>
                          ))}
                          {grimoire.chapters.length > 3 && (
                            <div className="text-gray-500">... e mais {grimoire.chapters.length - 3} capítulos</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {hasAccess ? (
                      <div className="space-y-2">
                        {grimoire.can_read_online && (
                          <Button className="w-full bg-green-800 hover:bg-green-700 font-cinzel">
                            <Book className="w-4 h-4 mr-2" />
                            Estudar Online
                          </Button>
                        )}
                        {grimoire.can_download && isPurchased && (
                          <Button className="w-full bg-blue-800 hover:bg-blue-700 font-cinzel">
                            <Download className="w-4 h-4 mr-2" />
                            Baixar Manuscrito
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {grimoire.can_read_online && (
                          <Button
                            onClick={() => rentMutation.mutate(grimoire.id)}
                            disabled={rentMutation.isPending}
                            className="w-full bg-blue-600 text-white hover:bg-blue-700 font-cinzel"
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            {rentMutation.isPending ? "Ritualizando..." : `Alugar 7d (R$ ${(grimoire.rental_price_brl / 100).toFixed(2)})`}
                          </Button>
                        )}
                        {grimoire.can_download && (
                          <Button
                            onClick={() => purchaseMutation.mutate(grimoire.id)}
                            disabled={purchaseMutation.isPending}
                            className="w-full bg-gradient-to-r from-amber-600 to-red-600 text-white hover:from-amber-700 hover:to-red-700 font-cinzel"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            {purchaseMutation.isPending ? "Adquirindo..." : `Adquirir (R$ ${(grimoire.price_brl / 100).toFixed(2)})`}
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Mystical Footer */}
                    <div className="mt-4 pt-3 border-t border-gray-800 text-xs text-gray-500 text-center">
                      "Conhecimento é poder, poder é responsabilidade"
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {grimoires.length === 0 && (
            <div className="text-center py-16">
              <Lock className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-cinzel text-gray-400 mb-2">Biblioteca em Preparação</h3>
              <p className="text-gray-600">
                Os manuscritos ancestrais estão sendo transcritos pelos escribas do templo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Grimoires() {
  return (
    <MysticalGate
      title="BIBLIOTECA ABISSAL"
      description="Santuário das trevas onde dormem manuscritos amaldiçoados dos antigos mestres. Grimórios que pulsam com poder ctônico, tratados que podem corromper a alma e escrituras que testam os limites da sanidade mortal."
      mysticText="Que a sabedoria dos ancestrais ilumine o caminho dos buscadores sinceros"
      icon={<Book className="w-8 h-8 text-amber-400" />}
    >
      <GrimoiresContent />
    </MysticalGate>
  );
}