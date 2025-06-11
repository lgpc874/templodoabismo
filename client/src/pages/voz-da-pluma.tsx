import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Feather, ArrowLeft, Sparkles, Eye, Flame, Star } from 'lucide-react';
import { FaTwitter, FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Footer from '../components/footer';
import RotatingSeal from '@/components/RotatingSeal';

interface VozPlumaManifestation {
  id: number;
  manifestation_time: string;
  type: string;
  title: string;
  content: string;
  author: string;
  posted_date: string;
  posted_at: string;
  is_current: boolean;
}

export default function VozDaPluma() {
  const { toast } = useToast();
  const [selectedManifestation, setSelectedManifestation] = useState<VozPlumaManifestation | null>(null);
  const [showDicaDialog, setShowDicaDialog] = useState(false);

  const { data: manifestations = [], isLoading } = useQuery<VozPlumaManifestation[]>({
    queryKey: ['/api/voz-pluma/manifestations'],
  });

  const poemaDoDia = manifestations.find(m => m.manifestation_time === '09:00');
  const ritualDominical = manifestations.find(m => m.manifestation_time === '07:00');
  const reflexaoDiaria = manifestations.find(m => m.manifestation_time === '11:00');
  const isDomingo = new Date().getDay() === 0;

  const handleViewRitual = () => {
    if (ritualDominical) {
      setSelectedManifestation(ritualDominical);
      setShowDicaDialog(true);
    } else {
      toast({
        title: "Ritual Dominical",
        description: "O ritual ancestral ainda está se manifestando...",
        className: "bg-red-900 border-red-500 text-white",
      });
    }
  };

  const handleViewReflexao = () => {
    if (reflexaoDiaria) {
      setSelectedManifestation(reflexaoDiaria);
      setShowDicaDialog(true);
    } else {
      toast({
        title: "Reflexão Diária",
        description: "A reflexão ainda está se manifestando...",
        className: "bg-amber-900 border-amber-500 text-white",
      });
    }
  };

  const shareToSocial = (platform: string, content: VozPlumaManifestation) => {
    const formattedDate = new Date(content.posted_date).toLocaleDateString('pt-BR');
    const text = `${content.title}\n\n"${content.content}"\n\n— ${content.author}\n\nManifestação das ${content.manifestation_time} • ${formattedDate}\n\n#TemploDoAbismo #VozDaPluma`;
    const url = window.location.href;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
      case 'instagram':
        navigator.clipboard.writeText(text).then(() => {
          toast({
            title: "Texto Copiado",
            description: "Cole no Instagram para compartilhar!",
            className: "bg-purple-900 border-purple-500 text-white",
          });
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen relative overflow-hidden">
        {/* Enhanced Mystical Particles with Mood Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none mystical-particles"></div>

        {/* Dynamic Atmosphere Particles */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-red-500/40 rounded-full particle-effect"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${12 + Math.random() * 8}s`
              }}
            />
          ))}
        </div>

        {/* Enhanced Floating Smoke Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-24 h-24 opacity-15 smoke-effect"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: '-96px',
                animationDelay: `${Math.random() * 8}s`,
                background: 'radial-gradient(circle, rgba(239,68,68,0.5) 0%, transparent 70%)'
              }}
            />
          ))}
        </div>

        {/* Selo Giratório Padrão */}
        <RotatingSeal variant="mystical" opacity={8} size="md" />

        {/* Mystical Energy Lines */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-red-500/15 to-transparent animate-flicker" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-amber-500/15 to-transparent animate-flicker" style={{animationDelay: '1.5s'}} />
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/15 to-transparent animate-flicker" style={{animationDelay: '2.5s'}} />
          <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/15 to-transparent animate-flicker" style={{animationDelay: '3.5s'}} />
        </div>

        {/* Atmospheric Gradient Overlay */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-transparent via-red-900/5 to-black/40"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Retornar ao Templo
            </Link>

            <div className="text-center">
              <div className="mb-8">
                <div className="text-amber-400 text-4xl mb-4">⛧</div>
                <h1 className="text-4xl md:text-6xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
                  VOZ DA PLUMA
                </h1>
                <div className="flex justify-center items-center space-x-6 text-amber-500 text-2xl mb-6">
                  <span>☿</span>
                  <span>⚹</span>
                  <span>𖤍</span>
                  <span>⚹</span>
                  <span>☿</span>
                </div>
              </div>
              
              <div className="floating-card p-6 space-y-4 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl max-w-3xl mx-auto">
                <p className="text-lg text-gray-300 leading-relaxed font-crimson">
                  Manifestações diárias do <strong className="text-amber-400">conhecimento ancestral</strong> 
                  onde a <strong className="text-red-400">Voz da Pluma</strong> sussurra os segredos eternos.
                </p>
                <div className="text-center">
                  <div className="text-amber-400 text-xl mb-2">𖤍 ⸸ 𖤍</div>
                  <p className="text-sm font-cinzel-decorative text-amber-300">
                    Versos renovados a cada 24 horas • Rituais dominicais às 7h • Reflexões às 11h
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
            
            {/* Verso da Pluma - 09:00 */}
            <div className="floating-card bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl hover:border-amber-500/40 transition-all duration-300">
              <div className="text-center p-6 pb-4">
                <div className="flex items-center justify-center gap-2 mb-3 text-amber-400">
                  <Feather className="w-6 h-6" />
                  <span className="text-lg font-semibold font-cinzel-decorative">09:00</span>
                </div>
                <h2 className="text-xl mb-2 text-amber-300 font-cinzel-decorative">Verso da Pluma</h2>
                <p className="text-sm text-gray-400 italic font-crimson">Renovado a cada 24 horas</p>
              </div>
              
              <div className="space-y-4 p-6 pt-0">
                {poemaDoDia ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-amber-300 font-cinzel-decorative text-center">{poemaDoDia.title}</h3>
                    <div className="bg-black/40 p-4 rounded-lg border border-amber-500/20">
                      <p className="text-gray-200 leading-relaxed italic text-center font-crimson text-sm">
                        "{poemaDoDia.content}"
                      </p>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-amber-400 font-semibold font-cinzel-decorative text-sm">— {poemaDoDia.author}</p>
                      <div className="text-amber-400">𖤍</div>
                    </div>

                    {/* Botões de Compartilhamento Compactos */}
                    <div className="flex flex-wrap gap-1 justify-center mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => shareToSocial('whatsapp', poemaDoDia)}
                        className="bg-green-900/20 border-green-500/50 text-green-300 hover:bg-green-800/30 font-crimson text-xs px-2 py-1"
                      >
                        <FaWhatsapp className="w-3 h-3" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => shareToSocial('instagram', poemaDoDia)}
                        className="bg-pink-900/20 border-pink-500/50 text-pink-300 hover:bg-pink-800/30 font-crimson text-xs px-2 py-1"
                      >
                        <FaInstagram className="w-3 h-3" />
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => shareToSocial('twitter', poemaDoDia)}
                        className="bg-blue-900/20 border-blue-500/50 text-blue-300 hover:bg-blue-800/30 font-crimson text-xs px-2 py-1"
                      >
                        <FaTwitter className="w-3 h-3" />
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => shareToSocial('facebook', poemaDoDia)}
                        className="bg-blue-900/20 border-blue-500/50 text-blue-300 hover:bg-blue-800/30 font-crimson text-xs px-2 py-1"
                      >
                        <FaFacebook className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/30">
                      <Feather className="w-6 h-6" />
                    </div>
                    <p className="text-gray-400 font-crimson text-sm">O verso ainda não manifestou...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Ritual Dominical - 07:00 (Somente Domingo) */}
            <div className="floating-card bg-black/30 backdrop-blur-lg border border-red-500/20 rounded-xl hover:border-red-500/40 transition-all duration-300">
              <div className="text-center p-6 pb-4">
                <div className="flex items-center justify-center gap-2 mb-3 text-red-400">
                  <Flame className="w-6 h-6" />
                  <span className="text-lg font-semibold font-cinzel-decorative">07:00</span>
                </div>
                <h2 className="text-xl mb-2 text-red-300 font-cinzel-decorative">Ritual Dominical</h2>
                <p className="text-sm text-gray-400 italic font-crimson">
                  {isDomingo ? 'Disponível hoje' : 'Somente aos domingos'}
                </p>
              </div>
              
              <div className="space-y-4 p-6 pt-0">
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/30">
                    <Star className="w-8 h-8" />
                  </div>
                  
                  {isDomingo ? (
                    <>
                      <p className="text-gray-300 mb-4 font-crimson text-sm">
                        Um <strong className="text-red-400">ritual ancestral</strong> aguarda sua contemplação
                      </p>
                      <div className="text-red-400 text-lg mb-3">⛧</div>
                      <Button 
                        onClick={handleViewRitual}
                        className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-6 py-2 rounded-lg font-semibold font-cinzel-decorative transition-all duration-300 shadow-lg hover:shadow-red-500/25 text-sm"
                      >
                        Revelar Ritual
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-500 mb-4 font-crimson text-sm">
                        O ritual ancestral manifesta-se apenas aos domingos às 7h
                      </p>
                      <div className="text-gray-600 text-lg">⚹</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Reflexão Diária - 11:00 (Todos os dias exceto domingo) */}
            <div className="floating-card bg-black/30 backdrop-blur-lg border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all duration-300">
              <div className="text-center p-6 pb-4">
                <div className="flex items-center justify-center gap-2 mb-3 text-purple-400">
                  <Eye className="w-6 h-6" />
                  <span className="text-lg font-semibold font-cinzel-decorative">11:00</span>
                </div>
                <h2 className="text-xl mb-2 text-purple-300 font-cinzel-decorative">Reflexão Diária</h2>
                <p className="text-sm text-gray-400 italic font-crimson">
                  {!isDomingo ? 'Disponível hoje' : 'Pausada aos domingos'}
                </p>
              </div>
              
              <div className="space-y-4 p-6 pt-0">
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/30">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  
                  {!isDomingo ? (
                    <>
                      <p className="text-gray-300 mb-4 font-crimson text-sm">
                        Uma <strong className="text-purple-400">reflexão sobre poder pessoal</strong> te espera
                      </p>
                      <div className="text-purple-400 text-lg mb-3">𖤍</div>
                      <Button 
                        onClick={handleViewReflexao}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-2 rounded-lg font-semibold font-cinzel-decorative transition-all duration-300 shadow-lg hover:shadow-purple-500/25 text-sm"
                      >
                        Revelar Reflexão
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-500 mb-4 font-crimson text-sm">
                        As reflexões cedem espaço ao ritual dominical
                      </p>
                      <div className="text-gray-600 text-lg">⸸</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog Ritual Ancestral - Estética Home Page */}
      <Dialog open={showDicaDialog} onOpenChange={setShowDicaDialog}>
        <DialogContent className="bg-black/90 backdrop-blur-lg border border-amber-500/30 text-white w-[95vw] max-w-md mx-auto rounded-xl overflow-hidden">
          <DialogHeader className="text-center pb-4">
            <div className="mb-4">
              <div className="text-red-400 text-3xl mb-3">⛧</div>
              <DialogTitle className="text-xl md:text-2xl text-amber-400 font-cinzel-decorative mystical-glow leading-tight">
                {selectedManifestation?.title || 'Manifestação Ancestral'}
              </DialogTitle>
              <div className="flex justify-center items-center space-x-4 text-amber-500 text-lg mt-3">
                <span>☿</span>
                <span>⚹</span>
                <span>𖤍</span>
                <span>⚹</span>
                <span>☿</span>
              </div>
            </div>
          </DialogHeader>
          
          {selectedManifestation && (
            <div className="space-y-4 px-2">
              <div className="floating-card bg-black/40 backdrop-blur-sm border border-amber-500/20 p-4 rounded-lg">
                <p className="text-gray-200 leading-relaxed text-center text-sm md:text-base font-crimson italic">
                  "{selectedManifestation.content}"
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="text-amber-400 text-lg">𖤍</div>
                <p className="text-amber-400 font-semibold text-sm md:text-base font-cinzel-decorative">— {selectedManifestation.author}</p>
                <p className="text-gray-400 text-xs md:text-sm font-crimson">
                  Manifestado às {selectedManifestation.manifestation_time} • {new Date(selectedManifestation.posted_date).toLocaleDateString('pt-BR')}
                </p>
                <div className="inline-block px-3 py-1 bg-red-900/30 rounded-full border border-red-500/30">
                  <span className="text-red-300 text-xs font-medium capitalize font-cinzel-decorative">
                    {selectedManifestation.type === 'dica' ? 'Ritual Dominical' : selectedManifestation.type}
                  </span>
                </div>
              </div>

              <div className="border-t border-amber-700/30 pt-4">
                <div className="text-center mb-3">
                  <div className="text-amber-400 text-lg">⸸</div>
                  <p className="text-xs font-cinzel-decorative text-amber-300">Compartilhar Sabedoria</p>
                </div>
                
                {/* Compartilhamento Ritualístico */}
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => shareToSocial('whatsapp', selectedManifestation)}
                    className="bg-green-900/20 border-green-500/50 text-green-300 hover:bg-green-800/30 text-xs py-2 font-crimson"
                  >
                    <FaWhatsapp className="w-3 h-3 mr-1" />
                    WhatsApp
                  </Button>

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => shareToSocial('instagram', selectedManifestation)}
                    className="bg-pink-900/20 border-pink-500/50 text-pink-300 hover:bg-pink-800/30 text-xs py-2 font-crimson"
                  >
                    <FaInstagram className="w-3 h-3 mr-1" />
                    Instagram
                  </Button>

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => shareToSocial('twitter', selectedManifestation)}
                    className="bg-blue-900/20 border-blue-500/50 text-blue-300 hover:bg-blue-800/30 text-xs py-2 font-crimson"
                  >
                    <FaTwitter className="w-3 h-3 mr-1" />
                    Twitter
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => shareToSocial('facebook', selectedManifestation)}
                    className="bg-blue-900/20 border-blue-500/50 text-blue-300 hover:bg-blue-800/30 text-xs py-2 font-crimson"
                  >
                    <FaFacebook className="w-3 h-3 mr-1" />
                    Facebook
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}