import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Feather, ArrowLeft, Sparkles, Eye, Flame, Star } from 'lucide-react';
import { FaTwitter, FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Footer from '../components/footer';

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
  const dicaDoDia = manifestations.find(m => m.manifestation_time === '07:00' || m.manifestation_time === '11:00');

  const handleViewDica = () => {
    if (dicaDoDia) {
      setSelectedManifestation(dicaDoDia);
      setShowDicaDialog(true);
    } else {
      toast({
        title: "Dica do Dia",
        description: "A dica ancestral ainda está se manifestando...",
        className: "bg-purple-900 border-purple-500 text-white",
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
        
        {/* Fixed Central Rotating Seal - Your Custom Image */}
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

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
            
            {/* Poema do Dia */}
            <div className="floating-card bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl hover:border-amber-500/40 transition-all duration-300">
              <div className="text-center p-6 pb-4">
                <div className="flex items-center justify-center gap-2 mb-3 text-amber-400">
                  <Feather className="w-6 h-6" />
                  <span className="text-lg font-semibold font-cinzel-decorative">09:00</span>
                </div>
                <h2 className="text-2xl mb-2 text-amber-300 font-cinzel-decorative">Verso da Pluma</h2>
                <p className="text-sm text-gray-400 italic font-crimson">Poema diário renovado a cada 24 horas</p>
              </div>
              
              <div className="space-y-6 p-6 pt-0">
                {poemaDoDia ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-amber-300 font-cinzel-decorative text-center">{poemaDoDia.title}</h3>
                    <div className="bg-black/40 p-6 rounded-lg border border-amber-500/20">
                      <p className="text-gray-200 leading-relaxed italic text-center font-crimson">
                        "{poemaDoDia.content}"
                      </p>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-amber-400 font-semibold font-cinzel-decorative">— {poemaDoDia.author}</p>
                      <p className="text-gray-400 text-sm font-crimson">
                        {new Date(poemaDoDia.posted_date).toLocaleDateString('pt-BR')}
                      </p>
                      <div className="text-amber-400 text-lg">𖤍</div>
                    </div>

                    {/* Botões de Compartilhamento */}
                    <div className="flex flex-wrap gap-2 justify-center mt-6">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => shareToSocial('twitter', poemaDoDia)}
                        className="bg-blue-900/20 border-blue-500/50 text-blue-300 hover:bg-blue-800/30 font-crimson"
                      >
                        <FaTwitter className="w-4 h-4 mr-2" />
                        Twitter
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => shareToSocial('facebook', poemaDoDia)}
                        className="bg-blue-900/20 border-blue-500/50 text-blue-300 hover:bg-blue-800/30 font-crimson"
                      >
                        <FaFacebook className="w-4 h-4 mr-2" />
                        Facebook
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => shareToSocial('whatsapp', poemaDoDia)}
                        className="bg-green-900/20 border-green-500/50 text-green-300 hover:bg-green-800/30 font-crimson"
                      >
                        <FaWhatsapp className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => shareToSocial('instagram', poemaDoDia)}
                        className="bg-pink-900/20 border-pink-500/50 text-pink-300 hover:bg-pink-800/30 font-crimson"
                      >
                        <FaInstagram className="w-4 h-4 mr-2" />
                        Instagram
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/30">
                      <Feather className="w-8 h-8" />
                    </div>
                    <p className="text-gray-400 font-crimson">O verso ainda não manifestou...</p>
                    <p className="text-gray-500 text-sm mt-2 font-crimson italic">A pluma ancestral escreve em seu tempo</p>
                  </div>
                )}
              </div>
            </div>

            {/* Dica do Dia */}
            <div className="floating-card bg-black/30 backdrop-blur-lg border border-red-500/20 rounded-xl hover:border-red-500/40 transition-all duration-300">
              <div className="text-center p-6 pb-4">
                <div className="flex items-center justify-center gap-2 mb-3 text-red-400">
                  <Sparkles className="w-6 h-6" />
                  <Star className="w-5 h-5" />
                </div>
                <h2 className="text-2xl mb-2 text-red-300 font-cinzel-decorative">Dica Ancestral</h2>
                <p className="text-sm text-gray-400 italic font-crimson">
                  {new Date().getDay() === 0 ? 'Ritual dominical disponível' : 'Reflexão diária disponível'}
                </p>
              </div>
              
              <div className="space-y-6 p-6 pt-0">
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/30">
                    <Eye className="w-10 h-10" />
                  </div>
                  <p className="text-gray-300 mb-6 font-crimson">
                    {new Date().getDay() === 0 
                      ? <>Um <strong className="text-red-400">ritual ancestral</strong> aguarda sua contemplação</>
                      : <>Uma <strong className="text-amber-400">reflexão sobre poder pessoal</strong> te espera</>
                    }
                  </p>
                  <div className="text-red-400 text-xl mb-4">⚹</div>
                  <Button 
                    onClick={handleViewDica}
                    className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white px-8 py-3 rounded-lg font-semibold font-cinzel-decorative transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                  >
                    Revelar Dica Ancestral
                  </Button>
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