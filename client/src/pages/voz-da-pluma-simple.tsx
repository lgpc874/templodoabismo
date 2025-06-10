import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Feather, ArrowLeft, Sparkles, Clock, Eye } from 'lucide-react';
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

  // Buscar poema do dia (9h)
  const poemaDoDia = manifestations.find(m => m.manifestation_time === '09:00');
  
  // Buscar dica do dia (ritual ou reflexão)
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, purple 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, purple 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Retornar ao Templo
            </Link>

            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
                Voz da Pluma
              </h1>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
                Manifestações diárias do conhecimento ancestral.<br/>
                <span className="text-amber-400">Poemas renovados a cada 24 horas • Dicas rituais disponíveis</span>
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
            
            {/* Poema do Dia */}
            <Card className="bg-black/40 backdrop-blur-sm border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-3 text-amber-400">
                  <Feather className="w-6 h-6" />
                  <span className="text-lg font-semibold">09:00</span>
                </div>
                <CardTitle className="text-2xl mb-2 text-amber-300">Verso da Pluma</CardTitle>
                <p className="text-sm text-gray-400 italic">Poema diário renovado a cada 24 horas</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {poemaDoDia ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-purple-300">{poemaDoDia.title}</h3>
                    <div className="bg-black/30 p-6 rounded-lg border border-purple-500/20">
                      <p className="text-gray-200 leading-relaxed italic text-center">
                        "{poemaDoDia.content}"
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-amber-400 font-semibold">— {poemaDoDia.author}</p>
                      <p className="text-gray-400 text-sm mt-1">
                        {new Date(poemaDoDia.posted_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/5 flex items-center justify-center text-amber-400">
                      <Feather className="w-8 h-8" />
                    </div>
                    <p className="text-gray-400">O verso ainda não manifestou...</p>
                    <p className="text-gray-500 text-sm mt-2">A pluma ancestral escreve em seu tempo</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dica do Dia */}
            <Card className="bg-black/40 backdrop-blur-sm border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-3 text-purple-400">
                  <Sparkles className="w-6 h-6" />
                  <Clock className="w-5 h-5" />
                </div>
                <CardTitle className="text-2xl mb-2 text-purple-300">Dica Ancestral</CardTitle>
                <p className="text-sm text-gray-400 italic">
                  {new Date().getDay() === 0 ? 'Ritual dominical disponível' : 'Reflexão diária disponível'}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/30">
                    <Eye className="w-10 h-10" />
                  </div>
                  <p className="text-gray-300 mb-6">
                    {new Date().getDay() === 0 
                      ? 'Um ritual ancestral aguarda sua contemplação'
                      : 'Uma reflexão sobre poder pessoal te espera'
                    }
                  </p>
                  <Button 
                    onClick={handleViewDica}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                  >
                    Revelar Dica Ancestral
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog Ritual para Dica */}
      <Dialog open={showDicaDialog} onOpenChange={setShowDicaDialog}>
        <DialogContent className="bg-black/95 border border-purple-500/50 text-white max-w-2xl">
          <DialogHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
            <DialogTitle className="text-2xl text-purple-300">
              {selectedManifestation?.title || 'Manifestação Ancestral'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedManifestation && (
            <div className="space-y-6 p-6">
              <div className="bg-purple-950/30 p-6 rounded-lg border border-purple-500/30">
                <p className="text-gray-200 leading-relaxed text-center text-lg">
                  "{selectedManifestation.content}"
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-amber-400 font-semibold text-lg">— {selectedManifestation.author}</p>
                <p className="text-gray-400">
                  Manifestado às {selectedManifestation.manifestation_time} • {new Date(selectedManifestation.posted_date).toLocaleDateString('pt-BR')}
                </p>
                <div className="inline-block px-4 py-2 bg-purple-900/50 rounded-full border border-purple-500/30 mt-4">
                  <span className="text-purple-300 text-sm font-medium capitalize">
                    {selectedManifestation.type}
                  </span>
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