import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, BookOpen, Download, Star, AlertTriangle } from "lucide-react";
import Footer from "../components/footer";

export default function Bibliotheca() {
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 6;

  // Fetch real grimoires from Supabase only
  const { data: grimoires, isLoading } = useQuery<any[]>({
    queryKey: ["/api/grimoires"],
    staleTime: 5 * 60 * 1000,
  });

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case "ritual": return "🕯️";
      case "invocacao": return "🔮";
      case "meditacao": return "🧘";
      case "filosofia": return "📜";
      default: return "📋";
    }
  };

  // Pagination logic for real data
  const totalPages = grimoires ? Math.ceil(grimoires.length / documentsPerPage) : 0;
  const startIndex = (currentPage - 1) * documentsPerPage;
  const endIndex = startIndex + documentsPerPage;
  const currentDocuments = grimoires?.slice(startIndex, endIndex) || [];

  const goToPage = (page: number) => {
    setCurrentPage(page);
    document.querySelector('.documents-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-amber-400 text-xl">Carregando biblioteca...</div>
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
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 pt-20">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-5xl">
          <div className="mb-8">
            <div className="text-amber-400 text-6xl mb-4">📚</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              BIBLIOTHECA ABYSSOS
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
              Arquivo de Conhecimento Sagrado
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              A biblioteca contém os <strong className="text-amber-400">grimórios autênticos</strong> e textos sagrados 
              preservados através dos séculos. Cada documento representa conhecimento real e prático 
              das tradições esotéricas ancestrais.
            </p>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Scientia Potentia Est"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                Conhecimento é Poder
              </p>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        {grimoires && grimoires.length > 0 ? (
          <div className="floating-card max-w-6xl w-full bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl documents-section">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-cinzel-decorative text-amber-300">
                  Grimórios Disponíveis ({grimoires.length})
                </h3>
                <div className="flex items-center gap-2 text-amber-400">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-sm">Biblioteca Ativa</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentDocuments.map((doc, index) => (
                  <div key={doc.id} className="floating-card bg-black/40 backdrop-blur-lg border border-amber-500/20 rounded-lg p-6 hover:border-amber-400/50 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">{getCategoryIcon(doc.category)}</div>
                      <div className="text-amber-400 text-sm bg-amber-400/10 px-2 py-1 rounded">
                        {doc.category || 'Geral'}
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-cinzel-decorative text-amber-300 mb-2 line-clamp-2">
                      {doc.title}
                    </h4>
                    
                    <p className="text-sm text-gray-400 mb-3 line-clamp-3">
                      {doc.description || 'Descrição não disponível'}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>Por: {doc.author || 'Autor Anônimo'}</span>
                      {doc.published && (
                        <span className="text-green-400">Publicado</span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <button className="bg-amber-600 hover:bg-amber-700 text-black px-4 py-2 rounded text-sm font-semibold transition-colors">
                        <Download className="w-4 h-4 inline mr-1" />
                        Acessar
                      </button>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm">5.0</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => goToPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => goToPage(i + 1)}
                      className={`px-3 py-2 rounded text-sm ${
                        currentPage === i + 1
                          ? 'bg-amber-600 text-black font-semibold'
                          : 'border border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="floating-card max-w-2xl w-full bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-cinzel-decorative text-amber-300 mb-4">
              Biblioteca em Preparação
            </h3>
            <p className="text-gray-300">
              A biblioteca está sendo preparada com conteúdo autêntico. 
              Novos grimórios serão adicionados em breve pelo Magus do Templo.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}