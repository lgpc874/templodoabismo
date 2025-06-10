import { useQuery } from "@tanstack/react-query";
import { Calendar, BookOpen, Feather } from "lucide-react";
import { Link } from "wouter";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  slug: string;
  category: string;
  tags: string[];
  featured_image?: string;
  created_at: string;
}

const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: "Os Fundamentos da Gnose Luciferiana",
    excerpt: "Uma introdução aos princípios fundamentais da tradição luciferiana e seus ensinamentos ancestrais sobre a busca pelo conhecimento verdadeiro.",
    author: "Mestre Astaroth",
    slug: "fundamentos-gnose-luciferiana",
    category: "Filosofia",
    tags: ["gnose", "fundamentos", "tradição"],
    featured_image: "/blog1.jpg",
    created_at: "2024-01-15"
  },
  {
    id: 2,
    title: "Rituais de Invocação: Teoria e Prática",
    excerpt: "Explorando as técnicas tradicionais de invocação e como aplicá-las de forma segura e eficaz nos rituais contemporâneos.",
    author: "Sacerdotisa Lilith",
    slug: "rituais-invocacao-teoria-pratica",
    category: "Rituais",
    tags: ["rituais", "invocação", "prática"],
    featured_image: "/blog2.jpg",
    created_at: "2024-01-20"
  },
  {
    id: 3,
    title: "A Simbologia dos Selos Salomônicos",
    excerpt: "Decifrando os mistérios por trás dos antigos selos e sua aplicação na magia contemporânea.",
    author: "Mago Baphomet",
    slug: "simbologia-selos-salomonicos",
    category: "Simbolismo",
    tags: ["selos", "símbolos", "magia"],
    featured_image: "/blog3.jpg",
    created_at: "2024-01-25"
  }
];

export default function Blog() {
  const { data: posts = mockPosts, isLoading } = useQuery({
    queryKey: ["/api/blog/posts"]
  });

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="text-amber-500 animate-pulse text-xl">Carregando artigos...</div>
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
              GNOSIS ABYSSOS
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
              Portal de Conhecimento Ancestral
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              Mergulhe nos <strong className="text-amber-400">ensinamentos públicos</strong> do luciferianismo ancestral e da gnose ctônica. 
              Cada artigo foi cuidadosamente crafted para iluminar os <strong className="text-red-400">caminhos da sabedoria oculta</strong> aos buscadores sinceros da verdade.
            </p>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Sapientia Occulta Omnibus"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                A sabedoria oculta para todos
              </p>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
          {posts.map((post: BlogPost) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <div className="floating-card group cursor-pointer transform hover:scale-105 transition-all duration-300">
                <div className="p-6 text-center">
                  {/* Featured Image */}
                  <div className="w-full h-48 bg-gradient-to-b from-amber-900/20 to-orange-900/20 rounded-lg mb-4 flex items-center justify-center border border-amber-600/30">
                    {post.featured_image ? (
                      <img 
                        src={post.featured_image} 
                        alt={post.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <BookOpen className="w-16 h-16 text-amber-500" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-amber-300 text-sm border border-amber-600/30 px-2 py-1 rounded">
                      {post.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-amber-400 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-400 text-sm mb-3">
                    <Feather className="w-4 h-4 mr-1" />
                    por {post.author}
                  </div>
                  
                  <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4 justify-center">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-gray-700/50 text-gray-300 border border-gray-600/30 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                    Ler artigo completo →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="floating-card max-w-2xl mx-auto p-8 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl text-center">
            <BookOpen className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl text-amber-200 mb-2 font-cinzel-decorative">Nenhum artigo disponível</h3>
            <p className="text-gray-400">Novos ensinamentos serão publicados em breve</p>
          </div>
        )}

        {/* Mystical Quote */}
        <div className="floating-card max-w-2xl mx-auto mt-12 p-8 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="text-center">
            <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
            <p className="text-lg text-gray-300 italic leading-relaxed mb-4">
              "A verdadeira sabedoria nasce da união entre conhecimento e experiência"
            </p>
            <p className="text-amber-400 font-semibold">
              — Antigo Axioma Luciferiano
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}