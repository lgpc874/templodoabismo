import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Feather, Share2, Instagram, Facebook, Twitter, Download } from "lucide-react";
import SiteNavigation from "../components/SiteNavigation";
import { useToast } from "../hooks/use-toast";

interface DailyPoem {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  image_url?: string;
}

export default function VozDaPluma() {
  const { toast } = useToast();
  const [selectedPoem, setSelectedPoem] = useState<DailyPoem | null>(null);

  const { data: todayPoem, isLoading } = useQuery({
    queryKey: ["/api/daily-poem"],
    refetchInterval: 24 * 60 * 60 * 1000, // Refetch every 24 hours
  });

  const { data: recentPoems = [] } = useQuery({
    queryKey: ["/api/poems/recent"],
  });

  const shareToSocial = (platform: string, poem: DailyPoem) => {
    const text = `"${poem.content}" - ${poem.author}`;
    const hashtags = "#TemploDoAbismo #VozDaPluma #Luciferiano #Sabedoria";
    
    let url = "";
    
    switch (platform) {
      case "instagram":
        // Instagram doesn't support direct URL sharing, so we copy to clipboard
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
      window.open(url, "_blank", "width=600,height=400");
    }
  };

  const downloadAsImage = async (poem: DailyPoem) => {
    try {
      // Create a canvas to generate the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 800;
      canvas.height = 800;

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#1a1a1a');
      gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add mystical border
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Title
      ctx.fillStyle = '#d97706';
      ctx.font = 'bold 32px serif';
      ctx.textAlign = 'center';
      ctx.fillText('VOZ DA PLUMA', canvas.width / 2, 80);

      // Poem content
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px serif';
      const words = poem.content.split(' ');
      let line = '';
      let y = 180;
      const maxWidth = canvas.width - 100;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, canvas.width / 2, y);
          line = words[n] + ' ';
          y += 35;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvas.width / 2, y);

      // Author
      ctx.fillStyle = '#d97706';
      ctx.font = 'italic 20px serif';
      ctx.fillText(`— ${poem.author}`, canvas.width / 2, y + 80);

      // Temple signature
      ctx.fillStyle = '#666666';
      ctx.font = '16px serif';
      ctx.fillText('TEMPLO DO ABISMO', canvas.width / 2, canvas.height - 40);

      // Download the image
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `voz-da-pluma-${poem.title.replace(/\s+/g, '-').toLowerCase()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast({
            title: "Imagem baixada",
            description: "A imagem foi salva em seus downloads.",
          });
        }
      }, 'image/png');
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Não foi possível gerar a imagem.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SiteNavigation />
      
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
          <div className="flex items-center justify-center mb-6">
            <Feather className="w-12 h-12 text-amber-400 mr-4" />
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-600">
              VOZ DA PLUMA
            </h1>
            <Feather className="w-12 h-12 text-amber-400 ml-4" />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Sussurros diários canalizados do abismo. Reflexões poéticas e prosa mística 
            geradas pela sabedoria ancestral para inspirar e iluminar o caminho dos iniciados.
          </p>
        </div>

        {/* Today's Poem */}
        {!isLoading && todayPoem && (
          <div className="floating-card max-w-4xl mx-auto mb-16">
            <div className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-amber-400 mb-2">Reflexão de Hoje</h2>
                <p className="text-gray-400">
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-amber-300 mb-6">{todayPoem.title}</h3>
                <div className="text-lg text-gray-300 leading-relaxed mb-8 max-w-3xl mx-auto italic">
                  "{todayPoem.content}"
                </div>
                <div className="text-amber-400 font-semibold text-lg">
                  — {todayPoem.author}
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => shareToSocial("instagram", todayPoem)}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </button>
                
                <button
                  onClick={() => shareToSocial("facebook", todayPoem)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </button>
                
                <button
                  onClick={() => shareToSocial("twitter", todayPoem)}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </button>
                
                <button
                  onClick={() => shareToSocial("whatsapp", todayPoem)}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  WhatsApp
                </button>
                
                <button
                  onClick={() => downloadAsImage(todayPoem)}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-amber-700 hover:to-red-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Baixar Imagem
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Poems Archive */}
        {recentPoems.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-amber-400 text-center mb-12">
              Arquivo dos Sussurros
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPoems.map((poem: DailyPoem) => (
                <div
                  key={poem.id}
                  className="floating-card cursor-pointer group hover:bg-amber-900/10 transition-all duration-300"
                  onClick={() => setSelectedPoem(poem)}
                >
                  <div className="p-6">
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-amber-400 mb-3">
                        {poem.title}
                      </h3>
                      <div className="text-sm text-gray-300 mb-4 line-clamp-3">
                        "{poem.content.substring(0, 120)}..."
                      </div>
                      <div className="text-amber-500 text-sm font-semibold mb-2">
                        — {poem.author}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(poem.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Poem Detail Modal */}
        {selectedPoem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
            <div className="floating-card max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-grow">
                    <h2 className="text-3xl font-bold text-amber-400 mb-2">
                      {selectedPoem.title}
                    </h2>
                    <p className="text-gray-400">
                      {new Date(selectedPoem.date).toLocaleDateString('pt-BR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedPoem(null)}
                    className="text-gray-400 hover:text-white text-2xl ml-4"
                  >
                    ×
                  </button>
                </div>

                <div className="text-center mb-8">
                  <div className="text-lg text-gray-300 leading-relaxed mb-6 italic">
                    "{selectedPoem.content}"
                  </div>
                  <div className="text-amber-400 font-semibold text-lg mb-8">
                    — {selectedPoem.author}
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => shareToSocial("instagram", selectedPoem)}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </button>
                  
                  <button
                    onClick={() => shareToSocial("facebook", selectedPoem)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </button>
                  
                  <button
                    onClick={() => shareToSocial("twitter", selectedPoem)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </button>
                  
                  <button
                    onClick={() => shareToSocial("whatsapp", selectedPoem)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    WhatsApp
                  </button>
                  
                  <button
                    onClick={() => downloadAsImage(selectedPoem)}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-amber-700 hover:to-red-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Baixar Imagem
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information Card */}
        <div className="floating-card max-w-2xl mx-auto mt-16">
          <div className="p-8 text-center">
            <Feather className="w-12 h-12 mx-auto mb-4 text-amber-400" />
            <h3 className="text-xl font-bold text-amber-400 mb-4">Sobre a Voz da Pluma</h3>
            <p className="text-gray-300 leading-relaxed">
              Todos os dias às 00:00, uma nova reflexão é canalizada diretamente dos mistérios abissais. 
              Compartilhe essa sabedoria ancestral com o mundo através das redes sociais ou baixe como imagem 
              para preservar estes ensinamentos sagrados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}