import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Download, 
  Clock, 
  Eye, 
  Star, 
  ShoppingCart, 
  Calendar,
  FileText,
  Crown,
  Zap,
  Search,
  Filter,
  Book,
  Bookmark,
  PlayCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Footer from "@/components/footer";

interface Grimoire {
  id: number;
  title: string;
  description: string;
  author: string;
  level: number;
  access_level: number;
  purchase_price_brl: number;
  rental_price_brl: number;
  chapter_price_brl: number;
  rental_days: number;
  total_chapters: number;
  pdf_url?: string;
  cover_image?: string;
  enable_rental: boolean;
  enable_purchase: boolean;
  enable_chapter_purchase: boolean;
  enable_online_reading: boolean;
  tags: string[];
  is_active: boolean;
  created_at: string;
}

interface GrimoireChapter {
  id: number;
  grimoire_id: number;
  chapter_number: number;
  title: string;
  content: string;
  summary: string;
  is_preview: boolean;
}

interface UserAccess {
  id: number;
  grimoire_id: number;
  access_type: string;
  chapter_id?: number;
  expires_at?: string;
  downloads_remaining: number;
}

export default function GrimoiresPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedGrimoire, setSelectedGrimoire] = useState<Grimoire | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<GrimoireChapter | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [accessFilter, setAccessFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [purchaseType, setPurchaseType] = useState<'rental' | 'purchase' | 'chapter'>('rental');
  const [showReaderDialog, setShowReaderDialog] = useState(false);

  // Fetch grimoires
  const { data: grimoires, isLoading } = useQuery({
    queryKey: ['/api/grimoires'],
    select: (data: Grimoire[]) => data.filter(g => g.is_active)
  });

  // Fetch user's grimoire access
  const { data: userAccess } = useQuery({
    queryKey: ['/api/user/grimoire-access'],
    enabled: !!user,
  });

  // Fetch chapters for selected grimoire
  const { data: chapters } = useQuery({
    queryKey: ['/api/grimoires', selectedGrimoire?.id, 'chapters'],
    enabled: !!selectedGrimoire && selectedGrimoire.enable_chapter_purchase,
  });

  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async (data: { grimoireId: number; type: string; chapterId?: number }) => {
      return await apiRequest('/api/grimoires/purchase', 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: "Compra Realizada",
        description: "Acesso ao grimório adquirido com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/grimoire-access'] });
      setShowPurchaseDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro na Compra",
        description: error.message || "Falha ao processar compra",
        variant: "destructive",
      });
    },
  });

  const filteredGrimoires = grimoires?.filter((grimoire: Grimoire) => {
    const matchesSearch = grimoire.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grimoire.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grimoire.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = levelFilter === 'all' || grimoire.level.toString() === levelFilter;
    
    const matchesAccess = accessFilter === 'all' || 
                         (accessFilter === 'rental' && grimoire.enable_rental) ||
                         (accessFilter === 'purchase' && grimoire.enable_purchase) ||
                         (accessFilter === 'chapters' && grimoire.enable_chapter_purchase);
    
    return matchesSearch && matchesLevel && matchesAccess;
  });

  const formatPrice = (centavos: number) => {
    return `R$ ${(centavos / 100).toFixed(2)}`;
  };

  const getLevelBadge = (level: number) => {
    const levels = {
      1: { label: 'Iniciante', color: 'bg-green-500' },
      2: { label: 'Aprendiz', color: 'bg-blue-500' },
      3: { label: 'Praticante', color: 'bg-purple-500' },
      4: { label: 'Adepto', color: 'bg-orange-500' },
      5: { label: 'Mestre', color: 'bg-red-500' }
    };
    const levelInfo = levels[level as keyof typeof levels] || levels[1];
    return <Badge className={levelInfo.color}>{levelInfo.label}</Badge>;
  };

  const getUserAccess = (grimoireId: number) => {
    if (!userAccess || !Array.isArray(userAccess)) return null;
    return userAccess.find((access: any) => access.grimoire_id === grimoireId);
  };

  const hasValidAccess = (grimoireId: number, type: string) => {
    const access = getUserAccess(grimoireId);
    if (!access) return false;
    
    if (type === 'rental' && access.access_type === 'rental') {
      return new Date(access.expires_at!) > new Date();
    }
    
    if (type === 'purchase' && access.access_type === 'purchase') {
      return access.downloads_remaining > 0;
    }
    
    return access.access_type === type;
  };

  const handlePurchase = (grimoire: Grimoire, type: 'rental' | 'purchase' | 'chapter') => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para adquirir grimórios",
        variant: "destructive",
      });
      return;
    }

    setSelectedGrimoire(grimoire);
    setPurchaseType(type);
    setShowPurchaseDialog(true);
  };

  const confirmPurchase = () => {
    if (!selectedGrimoire) return;

    const data: any = {
      grimoireId: selectedGrimoire.id,
      type: purchaseType,
    };

    if (purchaseType === 'chapter' && selectedChapter) {
      data.chapterId = selectedChapter.id;
    }

    purchaseMutation.mutate(data);
  };

  const openReader = (grimoire: Grimoire, chapter?: GrimoireChapter) => {
    setSelectedGrimoire(grimoire);
    setSelectedChapter(chapter || null);
    setShowReaderDialog(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-400">Carregando Grimórios...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fixed Central Rotating Seal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="rotating-seal w-96 h-96 opacity-10">
          <img 
            src="/seal.png" 
            alt="Selo dos Grimórios" 
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>
      </div>

      {/* Mystical floating particles */}
      <div className="fixed inset-0 overflow-hidden z-0">
        <div className="mystical-particles"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 via-transparent to-black/80"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 mb-4">
              Bibliotheca Abyssos
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Textos ancestrais e grimórios luciferinos para sua jornada de conhecimento
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar grimórios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-32 bg-gray-900 border-gray-700">
                  <SelectValue placeholder="Nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="1">Iniciante</SelectItem>
                  <SelectItem value="2">Aprendiz</SelectItem>
                  <SelectItem value="3">Praticante</SelectItem>
                  <SelectItem value="4">Adepto</SelectItem>
                  <SelectItem value="5">Mestre</SelectItem>
                </SelectContent>
              </Select>

              <Select value={accessFilter} onValueChange={setAccessFilter}>
                <SelectTrigger className="w-32 bg-gray-900 border-gray-700">
                  <SelectValue placeholder="Acesso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="rental">Aluguel</SelectItem>
                  <SelectItem value="purchase">Compra</SelectItem>
                  <SelectItem value="chapters">Capítulos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Grimoires Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGrimoires?.map((grimoire: Grimoire) => {
            const hasRentalAccess = hasValidAccess(grimoire.id, 'rental');
            const hasPurchaseAccess = hasValidAccess(grimoire.id, 'purchase');
            const userGrimoireAccess = getUserAccess(grimoire.id);

            return (
              <Card key={grimoire.id} className="bg-gray-900 border-gray-700 hover:bg-gray-800 transition-colors">
                <CardHeader className="pb-3">
                  {grimoire.cover_image && (
                    <div className="w-full h-48 bg-gray-800 rounded-lg mb-4 overflow-hidden">
                      <img 
                        src={grimoire.cover_image} 
                        alt={grimoire.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-red-400 text-lg mb-2 line-clamp-2">
                        {grimoire.title}
                      </CardTitle>
                      <p className="text-sm text-gray-400 mb-2">por {grimoire.author}</p>
                    </div>
                    {getLevelBadge(grimoire.level)}
                  </div>
                  
                  <CardDescription className="text-gray-300 line-clamp-3">
                    {grimoire.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="py-3">
                  <div className="space-y-3">
                    {/* Access Status */}
                    {(hasRentalAccess || hasPurchaseAccess) && (
                      <div className="bg-green-900/20 border border-green-700 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-green-400" />
                          <span className="text-green-400 font-medium">Acesso Ativo</span>
                        </div>
                        {hasRentalAccess && userGrimoireAccess?.expires_at && (
                          <p className="text-sm text-gray-400 mt-1">
                            Expira em: {new Date(userGrimoireAccess.expires_at).toLocaleDateString()}
                          </p>
                        )}
                        {hasPurchaseAccess && (
                          <p className="text-sm text-gray-400 mt-1">
                            Downloads restantes: {userGrimoireAccess?.downloads_remaining}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Pricing Options */}
                    <div className="space-y-2">
                      {grimoire.enable_rental && (
                        <div className="flex justify-between items-center p-2 bg-blue-900/20 rounded border border-blue-700">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-400" />
                            <span className="text-sm">Aluguel {grimoire.rental_days} dias</span>
                          </div>
                          <span className="font-medium text-blue-400">
                            {formatPrice(grimoire.rental_price_brl)}
                          </span>
                        </div>
                      )}

                      {grimoire.enable_purchase && (
                        <div className="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-700">
                          <div className="flex items-center gap-2">
                            <Download className="h-4 w-4 text-green-400" />
                            <span className="text-sm">Compra definitiva</span>
                          </div>
                          <span className="font-medium text-green-400">
                            {formatPrice(grimoire.purchase_price_brl)}
                          </span>
                        </div>
                      )}

                      {grimoire.enable_chapter_purchase && (
                        <div className="flex justify-between items-center p-2 bg-purple-900/20 rounded border border-purple-700">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-purple-400" />
                            <span className="text-sm">Por capítulo ({grimoire.total_chapters})</span>
                          </div>
                          <span className="font-medium text-purple-400">
                            {formatPrice(grimoire.chapter_price_brl)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {grimoire.tags && grimoire.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {grimoire.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-gray-600">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="pt-3">
                  <div className="flex gap-2 w-full">
                    {/* Read/Access buttons */}
                    {(hasRentalAccess || hasPurchaseAccess) ? (
                      <div className="flex gap-2 w-full">
                        {grimoire.enable_online_reading && (
                          <Button 
                            onClick={() => openReader(grimoire)}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ler Online
                          </Button>
                        )}
                        {hasPurchaseAccess && grimoire.pdf_url && (
                          <Button 
                            variant="outline"
                            className="flex-1 border-gray-600"
                            onClick={() => {
                              window.open(`/api/grimoires/${grimoire.id}/download`, '_blank');
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="flex gap-2 w-full">
                        {grimoire.enable_rental && (
                          <Button 
                            onClick={() => handlePurchase(grimoire, 'rental')}
                            variant="outline"
                            size="sm"
                            className="flex-1 border-blue-600 text-blue-400 hover:bg-blue-900/20"
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Alugar
                          </Button>
                        )}
                        {grimoire.enable_purchase && (
                          <Button 
                            onClick={() => handlePurchase(grimoire, 'purchase')}
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Comprar
                          </Button>
                        )}
                        {grimoire.enable_chapter_purchase && (
                          <Button 
                            onClick={() => handlePurchase(grimoire, 'chapter')}
                            variant="outline"
                            size="sm"
                            className="flex-1 border-purple-600 text-purple-400 hover:bg-purple-900/20"
                          >
                            <BookOpen className="h-4 w-4 mr-1" />
                            Capítulos
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {filteredGrimoires?.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">Nenhum grimório encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros de busca</p>
          </div>
        )}
      </div>

      {/* Purchase Dialog */}
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-red-400">
              Adquirir Grimório: {selectedGrimoire?.title}
            </DialogTitle>
            <DialogDescription>
              Confirme a aquisição do grimório com o tipo de acesso selecionado.
            </DialogDescription>
          </DialogHeader>

          {selectedGrimoire && (
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Detalhes da Compra:</h4>
                
                {purchaseType === 'rental' && (
                  <div className="space-y-2">
                    <p>• Aluguel por {selectedGrimoire.rental_days} dias</p>
                    <p>• Acesso online completo</p>
                    <p className="text-blue-400 font-medium">
                      Total: {formatPrice(selectedGrimoire.rental_price_brl)}
                    </p>
                  </div>
                )}

                {purchaseType === 'purchase' && (
                  <div className="space-y-2">
                    <p>• Compra definitiva</p>
                    <p>• 5 downloads inclusos</p>
                    <p>• Acesso online permanente</p>
                    <p className="text-green-400 font-medium">
                      Total: {formatPrice(selectedGrimoire.purchase_price_brl)}
                    </p>
                  </div>
                )}

                {purchaseType === 'chapter' && (
                  <div className="space-y-2">
                    <p>• Compra por capítulo</p>
                    <p>• {selectedGrimoire.total_chapters} capítulos disponíveis</p>
                    <p>• Acesso online ao capítulo</p>
                    <p className="text-purple-400 font-medium">
                      Preço por capítulo: {formatPrice(selectedGrimoire.chapter_price_brl)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPurchaseDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={confirmPurchase}
              disabled={purchaseMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {purchaseMutation.isPending ? 'Processando...' : 'Confirmar Compra'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reader Dialog */}
      <Dialog open={showReaderDialog} onOpenChange={setShowReaderDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-red-400">
              {selectedGrimoire?.title}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-96 w-full">
            <div className="p-4 space-y-4">
              {selectedChapter ? (
                <div>
                  <h3 className="text-lg font-medium mb-2 text-purple-400">
                    Capítulo {selectedChapter.chapter_number}: {selectedChapter.title}
                  </h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{selectedChapter.content}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium mb-4 text-red-400">Descrição do Grimório</h3>
                  <p className="text-gray-300 mb-6">{selectedGrimoire?.description}</p>
                  
                  {selectedGrimoire?.enable_chapter_purchase && chapters && Array.isArray(chapters) && (
                    <div>
                      <h4 className="text-md font-medium mb-3 text-purple-400">Capítulos Disponíveis:</h4>
                      <div className="space-y-2">
                        {chapters.map((chapter: any) => (
                          <div key={chapter.id} className="flex justify-between items-center p-3 bg-gray-800 rounded border border-gray-700">
                            <div>
                              <h5 className="font-medium">
                                Cap. {chapter.chapter_number}: {chapter.title}
                              </h5>
                              {chapter.summary && (
                                <p className="text-sm text-gray-400 mt-1">{chapter.summary}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {chapter.is_preview ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedChapter(chapter)}
                                  className="border-green-600 text-green-400"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Preview
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => handlePurchase(selectedGrimoire!, 'chapter')}
                                  className="bg-purple-600 hover:bg-purple-700"
                                >
                                  {formatPrice(selectedGrimoire!.chapter_price_brl)}
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter>
            {selectedChapter && (
              <Button variant="outline" onClick={() => setSelectedChapter(null)}>
                Voltar
              </Button>
            )}
            <Button onClick={() => setShowReaderDialog(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}