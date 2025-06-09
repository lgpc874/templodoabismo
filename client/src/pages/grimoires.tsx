import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Download, Clock, Lock, Eye, Star } from "lucide-react";
import Navigation from "../components/navigation";
import { useAuth } from "../contexts/AuthContext";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";

interface Grimoire {
  id: number;
  title: string;
  description: string;
  chapters: string[];
  access_level: number;
  price_tkazh: number;
  rental_price_tkazh: number;
  rental_days: number;
  pdf_url?: string;
  cover_image?: string;
  can_read_online: boolean;
  can_download: boolean;
  is_active: boolean;
}

interface GrimoireRental {
  id: number;
  grimoire_id: number;
  expires_at: string;
}

export default function Grimoires() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedGrimoire, setSelectedGrimoire] = useState<Grimoire | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: grimoires = [], isLoading } = useQuery({
    queryKey: ["/api/grimoires"],
  });

  const { data: userRentals = [] } = useQuery({
    queryKey: ["/api/user/rentals"],
    enabled: isAuthenticated,
  });

  const { data: userPurchases = [] } = useQuery({
    queryKey: ["/api/user/purchases"],
    enabled: isAuthenticated,
  });

  const rentMutation = useMutation({
    mutationFn: async (grimoireId: number) => {
      return await apiRequest(`/api/grimoires/${grimoireId}/rent`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      toast({
        title: "Grimório Alugado",
        description: "Você tem 7 dias para estudar este conhecimento sagrado.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/rentals"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro no Aluguel",
        description: error.message || "Não foi possível alugar o grimório.",
        variant: "destructive",
      });
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: async (grimoireId: number) => {
      return await apiRequest(`/api/grimoires/${grimoireId}/purchase`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      toast({
        title: "Grimório Adquirido",
        description: "Este conhecimento ancestral agora é seu para sempre.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/purchases"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro na Compra",
        description: error.message || "Não foi possível comprar o grimório.",
        variant: "destructive",
      });
    },
  });

  const hasAccess = (grimoire: Grimoire): 'owned' | 'rented' | 'none' => {
    if (userPurchases.some((p: any) => p.grimoire_id === grimoire.id)) {
      return 'owned';
    }
    
    const rental = userRentals.find((r: GrimoireRental) => r.grimoire_id === grimoire.id);
    if (rental && new Date(rental.expires_at) > new Date()) {
      return 'rented';
    }
    
    return 'none';
  };

  const canAccess = (grimoire: Grimoire): boolean => {
    if (!isAuthenticated) return false;
    if (!user) return false;
    
    // Check user initiation level
    if (user.initiation_level < grimoire.access_level) return false;
    
    return true;
  };

  const getRemainingDays = (grimoire: Grimoire): number => {
    const rental = userRentals.find((r: GrimoireRental) => r.grimoire_id === grimoire.id);
    if (!rental) return 0;
    
    const expiry = new Date(rental.expires_at);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      
      {/* Fixed Central Rotating Seal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="rotating-seal w-96 h-96 opacity-15">
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

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-600">
            GRIMÓRIOS ANCESTRAIS
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Biblioteca sagrada de conhecimentos luciferianos. Alugue por 7 dias para estudos temporários 
            ou adquira permanentemente para download e posse eterna.
          </p>
        </div>

        {!isAuthenticated && (
          <div className="floating-card max-w-2xl mx-auto mb-12 p-8 text-center">
            <Lock className="w-16 h-16 mx-auto mb-4 text-amber-500" />
            <h3 className="text-2xl font-bold text-amber-400 mb-4">Acesso Restrito</h3>
            <p className="text-gray-300 mb-6">
              Os grimórios ancestrais estão protegidos. Faça login para acessar a biblioteca sagrada.
            </p>
            <button className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-red-700 transition-colors">
              Entrar no Templo
            </button>
          </div>
        )}

        {/* View Toggle */}
        {isAuthenticated && (
          <div className="flex justify-center mb-8">
            <div className="floating-card p-1 inline-flex">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-amber-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Grade
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-amber-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Lista
              </button>
            </div>
          </div>
        )}

        {/* Grimoires Grid/List */}
        {isAuthenticated && (
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}`}>
            {grimoires.map((grimoire: Grimoire) => {
              const accessType = hasAccess(grimoire);
              const canAccessGrimoire = canAccess(grimoire);
              const remainingDays = getRemainingDays(grimoire);

              return (
                <div key={grimoire.id} className={`floating-card group ${viewMode === 'list' ? 'flex gap-6' : ''}`}>
                  {/* Cover Image */}
                  {viewMode === 'grid' && (
                    <div className="h-48 bg-gradient-to-b from-amber-900/20 to-red-900/20 rounded-t-lg flex items-center justify-center mb-4">
                      {grimoire.cover_image ? (
                        <img 
                          src={grimoire.cover_image} 
                          alt={grimoire.title}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      ) : (
                        <BookOpen className="w-16 h-16 text-amber-400" />
                      )}
                    </div>
                  )}

                  <div className="p-6 flex-grow">
                    {/* Status Badges */}
                    <div className="flex gap-2 mb-4">
                      {accessType === 'owned' && (
                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          PROPRIEDADE
                        </span>
                      )}
                      {accessType === 'rented' && (
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          ALUGADO ({remainingDays}d restantes)
                        </span>
                      )}
                      {!canAccessGrimoire && (
                        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          NÍVEL {grimoire.access_level} REQUERIDO
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-amber-400 mb-3">
                      {grimoire.title}
                    </h3>
                    
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      {grimoire.description}
                    </p>

                    {/* Chapters Preview */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">
                        Capítulos ({grimoire.chapters.length}):
                      </h4>
                      <div className="text-xs text-gray-500 space-y-1 max-h-20 overflow-y-auto">
                        {grimoire.chapters.slice(0, 3).map((chapter, index) => (
                          <div key={index}>• {chapter}</div>
                        ))}
                        {grimoire.chapters.length > 3 && (
                          <div className="text-amber-400">... e mais {grimoire.chapters.length - 3} capítulos</div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {!canAccessGrimoire ? (
                        <button disabled className="w-full bg-gray-600 text-gray-400 py-2 rounded-lg cursor-not-allowed flex items-center justify-center gap-2">
                          <Lock className="w-4 h-4" />
                          Acesso Negado
                        </button>
                      ) : accessType === 'owned' ? (
                        <div className="space-y-2">
                          {grimoire.can_read_online && (
                            <button
                              onClick={() => setSelectedGrimoire(grimoire)}
                              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Ler Online
                            </button>
                          )}
                          {grimoire.can_download && grimoire.pdf_url && (
                            <a
                              href={grimoire.pdf_url}
                              download
                              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download PDF
                            </a>
                          )}
                        </div>
                      ) : accessType === 'rented' ? (
                        <div className="space-y-2">
                          {grimoire.can_read_online && (
                            <button
                              onClick={() => setSelectedGrimoire(grimoire)}
                              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Ler Online ({remainingDays}d)
                            </button>
                          )}
                          {grimoire.can_download && (
                            <button
                              onClick={() => purchaseMutation.mutate(grimoire.id)}
                              disabled={purchaseMutation.isPending}
                              className="w-full bg-gradient-to-r from-amber-600 to-red-600 text-white py-2 rounded-lg font-semibold hover:from-amber-700 hover:to-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              {purchaseMutation.isPending ? "Comprando..." : `Comprar (R$ ${(grimoire.price_brl / 100).toFixed(2)})`}
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {grimoire.can_read_online && (
                            <button
                              onClick={() => rentMutation.mutate(grimoire.id)}
                              disabled={rentMutation.isPending}
                              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              <Clock className="w-4 h-4" />
                              {rentMutation.isPending ? "Alugando..." : `Alugar 7d (R$ ${(grimoire.rental_price_brl / 100).toFixed(2)})`}
                            </button>
                          )}
                          {grimoire.can_download && (
                            <button
                              onClick={() => purchaseMutation.mutate(grimoire.id)}
                              disabled={purchaseMutation.isPending}
                              className="w-full bg-gradient-to-r from-amber-600 to-red-600 text-white py-2 rounded-lg font-semibold hover:from-amber-700 hover:to-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              {purchaseMutation.isPending ? "Comprando..." : `Comprar (R$ ${(grimoire.price_brl / 100).toFixed(2)})`}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Grimoire Reader Modal */}
        {selectedGrimoire && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
            <div className="floating-card max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-amber-400 mb-2">
                      {selectedGrimoire.title}
                    </h2>
                    <p className="text-gray-300">{selectedGrimoire.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedGrimoire(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Chapter Navigation */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-amber-400">Índice de Capítulos</h3>
                  {selectedGrimoire.chapters.map((chapter, index) => (
                    <div key={index} className="p-4 bg-black/20 rounded-lg border border-amber-500/20">
                      <h4 className="font-semibold text-amber-300 mb-2">
                        Capítulo {index + 1}: {chapter}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Conteúdo do capítulo seria exibido aqui em implementação completa...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}