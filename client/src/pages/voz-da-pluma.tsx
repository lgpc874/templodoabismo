import { useState } from "react";
import { Feather, Share2, Instagram, Facebook, Twitter, Download } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useDailyPoem, useRecentPoems } from "@/hooks/useSupabaseData";

interface DailyPoem {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  image_url?: string;
}

const mockPoems: DailyPoem[] = [
  {
    id: 1,
    title: "Lux Tenebris",
    content: "Nas profundezas do silêncio eterno, onde sussurra a verdade ancestral, a chama dourada da gnose desperta, revelando os mistérios do conhecimento primordial.",
    author: "Mestre Astaroth",
    date: "2024-01-15"
  },
  {
    id: 2,
    title: "Serpens Sophia",
    content: "A serpente da sabedoria desenrola seus anéis cósmicos, cada escama uma lição do abismo, cada movimento uma dança entre luz e sombra.",
    author: "Sacerdotisa Lilith",
    date: "2024-01-14"
  },
  {
    id: 3,
    title: "Ignis Aeternus",
    content: "O fogo eterno queima no altar do coração, consumindo ilusões e forjando a alma na fornalha da verdade luciferiana.",
    author: "Mago Baphomet",
    date: "2024-01-13"
  }
];

export default function VozDaPluma() {
  const { toast } = useToast();
  const [selectedPoem, setSelectedPoem] = useState<DailyPoem | null>(null);

  const { data: todayPoem, isLoading } = useDailyPoem();
  const { data: recentPoems = mockPoems } = useRecentPoems();

  const shareToSocial = (platform: string, poem: DailyPoem) => {
    const text = `"${poem.content}" - ${poem.author}`;
    const hashtags = "#TemploDoAbismo #VozDaPluma #Luciferiano #Sabedoria";
    
    let url = "";
    
    switch (platform) {
      case "instagram":
        navigator.clipboard.writeText(`${text}\n\n${hashtags}`);
        toast({
          title: "Copiado para área de transferência",
          description: "Cole no Instagram Stories ou feed.",
        });
        return;
        
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
        break;
        
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent("TemploDoAbismo,VozDaPluma")}`;
        break;
        
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(text + "\n\n" + hashtags)}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank');
    }
  };

  const downloadPoem = (poem: DailyPoem) => {
    const content = `${poem.title}\n\n${poem.content}\n\n— ${poem.author}\n${poem.date}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${poem.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Poema baixado",
      description: "O arquivo foi salvo em seus downloads.",
    });
  };

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
            <div className="text-amber-400 text-6xl mb-4">𖤍</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              VOZ DA PLUMA
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
              Versos da Sabedoria Ancestral
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              Cada verso é uma <strong className="text-amber-400">chave dourada</strong> que abre as portas da percepção. 
              Deixe que a <strong className="text-red-400">poesia luciferiana</strong> desperte em ti a centelha divina do conhecimento oculto.
            </p>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Verba Volant, Scripta Manent"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                As palavras voam, os escritos permanecem
              </p>
            </div>
          </div>
        </div>

        {/* Today's Featured Poem */}
        {(todayPoem || recentPoems[0]) && (
          <div className="floating-card max-w-4xl mx-auto mb-12 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
            <div className="p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <Feather className="w-8 h-8 text-amber-400 mr-3" />
                <h3 className="text-2xl font-cinzel-decorative text-amber-300">
                  Verso do Dia
                </h3>
              </div>
              
              {(() => {
                const poem = todayPoem || recentPoems[0];
                return (
                  <div className="space-y-6">
                    <h4 className="text-xl font-bold text-amber-400 mb-4">
                      {poem.title}
                    </h4>
                    
                    <blockquote className="text-lg text-gray-300 italic leading-relaxed border-l-4 border-amber-500/30 pl-6 py-4">
                      "{poem.content}"
                    </blockquote>
                    
                    <div className="flex items-center justify-center space-x-4 text-gray-400">
                      <span>— {poem.author}</span>
                      <span>•</span>
                      <span>{new Date(poem.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    {/* Share buttons */}
                    <div className="flex justify-center space-x-4 pt-4">
                      <button
                        onClick={() => shareToSocial('twitter', poem)}
                        className="p-2 rounded-full bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 transition-colors"
                        title="Compartilhar no Twitter"
                      >
                        <Twitter className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => shareToSocial('facebook', poem)}
                        className="p-2 rounded-full bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 transition-colors"
                        title="Compartilhar no Facebook"
                      >
                        <Facebook className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => shareToSocial('instagram', poem)}
                        className="p-2 rounded-full bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 transition-colors"
                        title="Copiar para Instagram"
                      >
                        <Instagram className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => downloadPoem(poem)}
                        className="p-2 rounded-full bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 transition-colors"
                        title="Baixar poema"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Recent Poems Grid */}
        <div className="max-w-6xl w-full">
          <h3 className="text-3xl font-cinzel-decorative text-amber-300 text-center mb-8 floating-title-slow">
            Arquivo dos Versos Sagrados
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPoems.slice(1).map((poem: DailyPoem) => (
              <div 
                key={poem.id} 
                className="floating-card group cursor-pointer transform hover:scale-105 transition-all duration-300"
                onClick={() => setSelectedPoem(poem)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-amber-400 line-clamp-1">
                      {poem.title}
                    </h4>
                    <Feather className="w-5 h-5 text-amber-500 group-hover:text-amber-300 transition-colors" />
                  </div>
                  
                  <blockquote className="text-sm text-gray-300 italic leading-relaxed mb-4 line-clamp-4">
                    "{poem.content}"
                  </blockquote>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>— {poem.author}</span>
                    <span>{new Date(poem.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  
                  <div className="mt-4 flex justify-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        shareToSocial('twitter', poem);
                      }}
                      className="p-1 rounded bg-amber-600/10 hover:bg-amber-600/20 text-amber-400 transition-colors"
                    >
                      <Share2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadPoem(poem);
                      }}
                      className="p-1 rounded bg-amber-600/10 hover:bg-amber-600/20 text-amber-400 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mystical Quote */}
        <div className="floating-card max-w-2xl mx-auto mt-12 p-8 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="text-center">
            <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
            <p className="text-lg text-gray-300 italic leading-relaxed mb-4">
              "A poesia é a linguagem dos deuses falando através do véu da eternidade"
            </p>
            <p className="text-amber-400 font-semibold">
              — Axioma do Templo
            </p>
          </div>
        </div>
      </div>

      {/* Poem Detail Modal */}
      {selectedPoem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedPoem(null)}
        >
          <div 
            className="floating-card max-w-2xl w-full bg-black/60 backdrop-blur-lg border border-amber-500/30 rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <Feather className="w-8 h-8 text-amber-400 mr-3" />
                <h3 className="text-2xl font-cinzel-decorative text-amber-300">
                  {selectedPoem.title}
                </h3>
              </div>
              
              <blockquote className="text-lg text-gray-300 italic leading-relaxed border-l-4 border-amber-500/30 pl-6 py-4 mb-6">
                "{selectedPoem.content}"
              </blockquote>
              
              <div className="flex items-center justify-center space-x-4 text-gray-400 mb-6">
                <span>— {selectedPoem.author}</span>
                <span>•</span>
                <span>{new Date(selectedPoem.date).toLocaleDateString('pt-BR')}</span>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => shareToSocial('twitter', selectedPoem)}
                  className="px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Twitter className="w-4 h-4" />
                  <span>Twitter</span>
                </button>
                <button
                  onClick={() => shareToSocial('facebook', selectedPoem)}
                  className="px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Facebook className="w-4 h-4" />
                  <span>Facebook</span>
                </button>
                <button
                  onClick={() => downloadPoem(selectedPoem)}
                  className="px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar</span>
                </button>
              </div>
              
              <button
                onClick={() => setSelectedPoem(null)}
                className="mt-6 px-6 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}