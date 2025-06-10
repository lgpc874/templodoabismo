import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, ShoppingCart, CreditCard } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import PaymentGateway from "@/components/PaymentGateway";

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
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="text-amber-500 animate-pulse text-xl">Carregando Grimorium...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fixed Central Rotating Seal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="rotating-seal w-96 h-96 opacity-20">
          <img 
            src="/seal.png" 
            alt="Selo do Templo do Abismo" 
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>
      </div>

      {/* Mystical floating particles */}
      <div className="fixed inset-0 overflow-hidden z-0">
        <div className="mystical-particles"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 via-transparent to-black/80"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-5xl">
          <div className="mb-8">
            <div className="text-amber-400 text-6xl mb-4">⛧</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              GRIMORIUM ARCANUM
            </h1>
            <div className="flex justify-center items-center space-x-8 text-amber-500 text-3xl mb-6">
              <span>☿</span>
              <span>⚹</span>
              <span>𖤍</span>
              <span>⚹</span>
              <span>☿</span>
            </div>
          </div>
          
          <div className="floating-card p-8 space-y-6 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
            <h2 className="text-3xl md:text-4xl font-cinzel-decorative text-amber-300 mb-6 floating-title-slow">
              Manuscritos Arcanos das Trevas
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              Adentre o <strong className="text-amber-400">grimorium forbidden</strong> onde repousam os textos mais antigos e poderosos da tradição luciferiana. 
              Cada grimório pulsa com o <strong className="text-red-400">poder primordial</strong> das correntes abissais, preservando conhecimentos que transcendem os véus da realidade.
            </p>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Scientia Potentia Est"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                O conhecimento é poder
              </p>
            </div>
          </div>
        </div>

        {/* Grimoires Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
          {grimoires.map((grimoire: Grimoire) => (
            <div key={grimoire.id} className="floating-card group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="p-6 text-center">
                {/* Grimoire Cover Image */}
                <div className="w-full h-48 bg-gradient-to-b from-amber-900/20 to-orange-900/20 rounded-lg mb-4 flex items-center justify-center border border-amber-600/30">
                  {grimoire.cover_image ? (
                    <img 
                      src={grimoire.cover_image} 
                      alt={grimoire.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <BookOpen className="w-16 h-16 text-amber-500" />
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-amber-400 mb-3">{grimoire.title}</h3>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">por {grimoire.author}</span>
                  <span className="text-amber-300 text-sm border border-amber-600/30 px-2 py-1 rounded">
                    Nível {grimoire.level}
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                  {grimoire.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-amber-400 font-bold text-lg">
                    R$ {grimoire.purchase_price_brl?.toFixed(2)}
                  </div>
                  
                  <button 
                    onClick={() => purchaseMutation.mutate(grimoire.id)}
                    disabled={purchaseMutation.isPending}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 py-2 rounded transition-all duration-300 flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {purchaseMutation.isPending ? 'Comprando...' : 'Comprar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {grimoires.length === 0 && (
          <div className="floating-card max-w-2xl mx-auto p-8 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl text-center">
            <BookOpen className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl text-amber-200 mb-2 font-cinzel-decorative">Nenhum grimório disponível</h3>
            <p className="text-gray-400">Novos textos sagrados serão adicionados em breve</p>
          </div>
        )}

        {/* Mystical Quote */}
        <div className="floating-card max-w-2xl mx-auto mt-12 p-8 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="text-center">
            <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
            <p className="text-lg text-gray-300 italic leading-relaxed mb-4">
              "O conhecimento é poder, mas a sabedoria é saber como usá-lo"
            </p>
            <p className="text-amber-400 font-semibold">
              — Axioma Luciferiano
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}