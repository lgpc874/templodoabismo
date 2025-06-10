import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Feather, Heart, Share2, MessageCircle, Star, Flame, Scroll } from "lucide-react";
import MysticalGate from "@/components/MysticalGate";

import { useAuth } from "@/contexts/AuthContext";

interface DailyPoem {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  likes?: number;
  shares?: number;
}

function VozDaPlumaContent() {
  const { user } = useAuth();
  const [selectedPoem, setSelectedPoem] = useState<DailyPoem | null>(null);

  const { data: dailyPoem, isLoading: dailyLoading } = useQuery<DailyPoem>({
    queryKey: ['/api/daily-poem'],
    refetchInterval: 24 * 60 * 60 * 1000, // Refetch every 24 hours
  });

  const { data: recentPoems = [], isLoading: recentLoading } = useQuery<DailyPoem[]>({
    queryKey: ['/api/poems/recent'],
  });

  const inspirationalTopics = [
    {
      title: "A Jornada Interior",
      description: "Reflexões sobre o caminho da auto-descoberta e despertar espiritual",
      icon: <Star className="w-6 h-6" />,
      color: "text-purple-400"
    },
    {
      title: "Mistérios Ancestrais",
      description: "Versos inspirados nos ensinamentos e tradições milenares",
      icon: <Scroll className="w-6 h-6" />,
      color: "text-amber-400"
    },
    {
      title: "Chamas da Transformação",
      description: "Poesias sobre mudança, transmutação e renascimento espiritual",
      icon: <Flame className="w-6 h-6" />,
      color: "text-red-400"
    }
  ];

  if (dailyLoading || recentLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="rotating-seal w-16 h-16 mx-auto mb-4">
            <Feather className="w-full h-full text-purple-500" />
          </div>
          <p className="text-gray-400">Canalizando as Inspirações Celestiais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">

      
      {/* Mystical background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-950/20 via-black to-indigo-950/20"></div>
        <div className="mystical-particles"></div>
      </div>

      {/* Central rotating seal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="rotating-seal w-96 h-96 opacity-5">
          <img 
            src="/seal.png" 
            alt="Selo da Inspiração" 
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>
      </div>

      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-cinzel font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-pink-400">
              VOX PLUMAE
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Portal de inspiração onde as musas sussurram versos sagrados através da pluma mística. 
              Cada poema é uma oração, cada verso uma revelação do divino que habita em todos os corações 
              que buscam a beleza e transcendência.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Daily Poem - Featured */}
            <div className="lg:col-span-2">
              {dailyPoem && (
                <Card className="glass-effect border-purple-900/50 mb-8">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3 text-purple-400 font-cinzel text-2xl">
                        <Feather className="w-8 h-8" />
                        Inspiração do Dia
                      </CardTitle>
                      <div className="text-sm text-gray-400">
                        {new Date(dailyPoem.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Title */}
                      <h3 className="text-2xl font-cinzel text-center text-purple-300 border-b border-purple-900/30 pb-4">
                        {dailyPoem.title}
                      </h3>
                      
                      {/* Poem Content */}
                      <div className="bg-gradient-to-br from-purple-950/30 to-indigo-950/30 p-6 rounded-lg border border-purple-900/30">
                        <div className="text-gray-100 leading-relaxed text-lg font-crimson whitespace-pre-line text-center italic">
                          {dailyPoem.content}
                        </div>
                      </div>
                      
                      {/* Author */}
                      <div className="text-right text-gray-400 font-cinzel">
                        — {dailyPoem.author}
                      </div>
                      
                      {/* Interaction Buttons */}
                      <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-800">
                        <Button variant="outline" size="sm" className="border-purple-900/50 text-purple-300 hover:bg-purple-900/20">
                          <Heart className="w-4 h-4 mr-2" />
                          Contemplar ({dailyPoem.likes || 0})
                        </Button>
                        <Button variant="outline" size="sm" className="border-indigo-900/50 text-indigo-300 hover:bg-indigo-900/20">
                          <Share2 className="w-4 h-4 mr-2" />
                          Compartilhar
                        </Button>
                        <Button variant="outline" size="sm" className="border-pink-900/50 text-pink-300 hover:bg-pink-900/20">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Refletir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Poems Archive */}
              <Card className="glass-effect border-indigo-900/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-indigo-400 font-cinzel">
                    <Scroll className="w-6 h-6" />
                    Arquivo de Inspirações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentPoems.length > 0 ? (
                    <div className="space-y-4">
                      {recentPoems.slice(0, 6).map((poem) => (
                        <div
                          key={poem.id}
                          className="p-4 bg-gray-900/30 rounded border border-gray-800/50 hover:border-indigo-900/50 transition-all cursor-pointer"
                          onClick={() => setSelectedPoem(poem)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-cinzel text-indigo-300">{poem.title}</h4>
                            <span className="text-xs text-gray-500">
                              {new Date(poem.created_at).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {poem.content.split('\n')[0]}...
                          </p>
                          <div className="text-xs text-gray-500 mt-2">
                            Por {poem.author}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      As inspirações anteriores aparecerão aqui...
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Inspiration Topics */}
              <Card className="glass-effect border-amber-900/30">
                <CardHeader>
                  <CardTitle className="text-amber-400 font-cinzel">
                    Temas de Inspiração
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inspirationalTopics.map((topic, index) => (
                      <div key={index} className="p-3 bg-gray-900/20 rounded border border-gray-800/50">
                        <div className={`flex items-center gap-3 mb-2 ${topic.color}`}>
                          {topic.icon}
                          <h4 className="font-cinzel font-semibold">{topic.title}</h4>
                        </div>
                        <p className="text-sm text-gray-400">{topic.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Mystical Quote */}
              <Card className="glass-effect border-pink-900/30">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Feather className="w-8 h-8 mx-auto mb-4 text-pink-400" />
                    <blockquote className="text-pink-300 italic font-crimson text-lg mb-4">
                      "A poesia é a linguagem da alma quando ela conversa com o divino."
                    </blockquote>
                    <cite className="text-sm text-gray-400">— Tradição Hermética</cite>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Reflection */}
              <Card className="glass-effect border-purple-900/30">
                <CardHeader>
                  <CardTitle className="text-purple-400 font-cinzel text-lg">
                    Reflexão Diária
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    Permita que os versos penetrem profundamente em seu ser. 
                    A verdadeira poesia não é apenas lida, mas experienciada 
                    como uma comunhão com o sagrado.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-purple-800 to-pink-800 hover:from-purple-700 hover:to-pink-700 font-cinzel">
                    Meditar com a Poesia
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Modal for Selected Poem */}
          {selectedPoem && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <Card className="glass-effect border-indigo-900/50 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-indigo-400 font-cinzel text-xl">
                      {selectedPoem.title}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPoem(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-indigo-950/30 to-purple-950/30 p-6 rounded-lg border border-indigo-900/30">
                      <div className="text-gray-100 leading-relaxed font-crimson whitespace-pre-line text-center italic">
                        {selectedPoem.content}
                      </div>
                    </div>
                    <div className="text-right text-gray-400 font-cinzel">
                      — {selectedPoem.author}
                    </div>
                    <div className="text-center text-sm text-gray-500">
                      {new Date(selectedPoem.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VozDaPluma() {
  return (
    <MysticalGate
      title="VOZ DA PLUMA"
      description="Santuário sombrio onde musas amaldiçoadas sussurram versos que podem corromper ou illuminar a alma. Portal da contemplação abissal onde a beleza emerge das trevas mais profundas da existência."
      mysticText="Que a poesia seja ponte entre o coração humano e o divino infinito"
      icon={<Feather className="w-8 h-8 text-purple-400" />}
    >
      <VozDaPlumaContent />
    </MysticalGate>
  );
}