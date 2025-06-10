import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ShoppingCart } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Grimoire {
  id: number;
  title: string;
  description: string;
  author: string;
  purchase_price_brl: number;
  cover_image?: string;
  level: number;
}

export default function Grimoires() {
  const queryClient = useQueryClient();

  const { data: grimoires = [], isLoading } = useQuery({
    queryKey: ["/api/grimoires"]
  });

  const purchaseMutation = useMutation({
    mutationFn: async (grimoireId: number) => {
      return await apiRequest(`/api/grimoires/${grimoireId}/purchase`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/grimoires"] });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-amber-500 animate-pulse text-xl">Carregando grimórios...</div>
      </div>
    );
  }

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
      <div className="max-w-6xl mx-auto text-center py-16">
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 mb-6 animate-title-float font-cinzel">
          Bibliotheca Arcana
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto animate-mystical-float">
          Explore nossa coleção de grimórios ancestrais, textos sagrados e manuscritos proibidos que revelam os segredos mais profundos da tradição luciferiana
        </p>
      </div>

      {/* Grimoires Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {grimoires.map((grimoire: Grimoire) => (
            <Card 
              key={grimoire.id}
              className="bg-gradient-to-b from-gray-900/50 to-black/50 border-2 border-gray-600 hover:border-amber-600 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              <CardHeader>
                {/* Grimoire Cover Image */}
                <div className="w-full h-48 bg-gradient-to-b from-amber-900/20 to-orange-900/20 rounded-lg mb-4 flex items-center justify-center border border-amber-600/30">
                  {grimoire.cover_image ? (
                    <img 
                      src={grimoire.cover_image} 
                      alt={grimoire.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <BookOpen className="w-16 h-16 text-amber-500 animate-mystical-float" />
                  )}
                </div>
                
                <CardTitle className="text-amber-200 text-lg font-cinzel animate-mystical-float">
                  {grimoire.title}
                </CardTitle>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">por {grimoire.author}</span>
                  <Badge variant="outline" className="border-amber-600 text-amber-400">
                    Nível {grimoire.level}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-gray-400 mb-4 line-clamp-3">
                  {grimoire.description}
                </CardDescription>
                
                <div className="flex items-center justify-between">
                  <div className="text-amber-400 font-bold text-lg">
                    R$ {grimoire.purchase_price_brl?.toFixed(2)}
                  </div>
                  
                  <Button 
                    onClick={() => purchaseMutation.mutate(grimoire.id)}
                    disabled={purchaseMutation.isPending}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {purchaseMutation.isPending ? 'Comprando...' : 'Comprar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {grimoires.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-mystical-float" />
            <h3 className="text-xl text-amber-200 mb-2 font-cinzel">Nenhum grimório disponível</h3>
            <p className="text-gray-400">Novos textos sagrados serão adicionados em breve</p>
          </div>
        )}
      </div>

      {/* Mystical Quote */}
      <div className="max-w-4xl mx-auto text-center py-16">
        <p className="text-gray-500 text-lg italic animate-mystical-float">
          "O conhecimento é poder, mas a sabedoria é saber como usá-lo"
        </p>
      </div>
    </div>
  );
}