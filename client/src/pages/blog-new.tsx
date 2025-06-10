import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

// Artigos serão carregados da API/banco de dados quando criados pelo painel administrativo

export default function Blog() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["/api/blog/posts"]
  });

  const blogPosts: BlogPost[] = Array.isArray(posts) ? posts : [];

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="text-amber-500 animate-pulse text-xl">Carregando artigos...</div>
      </div>
    );
  }

  return (
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

      {/* Selo Central Fixo */}
      <div className="fixed top-1/2 left-1/2 z-0 transform -translate-x-1/2 -translate-y-1/2" style={{marginTop: '2rem'}}>
        <div className="absolute w-80 h-80 opacity-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow-reverse text-amber-500/15 text-[20rem] leading-none flex items-center justify-center h-full">◯</div>
        </div>
        <div className="absolute w-72 h-72 opacity-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow text-red-400/20 text-[18rem] leading-none flex items-center justify-center h-full">☿</div>
        </div>
        <div className="rotating-seal absolute w-64 h-64 opacity-15 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow text-red-500/30 text-[16rem] leading-none flex items-center justify-center h-full">⸸</div>
        </div>
        <div className="absolute w-16 h-16 opacity-25 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-red-300/40 text-4xl leading-none flex items-center justify-center h-full">●</div>
        </div>
      </div>

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
        <div className="floating-card max-w-6xl w-full bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post: BlogPost) => (
                <Card 
                  key={post.id}
                  className="bg-black/20 border-amber-500/20 hover:border-amber-400/40 transition-colors"
                >
                  <CardHeader>
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
                      <Badge variant="outline" className="border-amber-600 text-amber-400">
                        {post.category}
                      </Badge>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(post.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    
                    <CardTitle className="text-amber-200 text-lg font-cinzel line-clamp-2">
                      {post.title}
                    </CardTitle>
                    
                    <div className="flex items-center text-gray-400 text-sm">
                      <Feather className="w-4 h-4 mr-1" />
                      por {post.author}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <CardDescription className="text-gray-400 mb-4 line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs bg-gray-700 text-gray-300 border-gray-600"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Link href={`/blog/${post.slug}`}>
                      <div className="text-amber-400 hover:text-amber-300 font-medium cursor-pointer transition-colors">
                        Ler artigo completo →
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {blogPosts.length === 0 && (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl text-amber-200 mb-2 font-cinzel-decorative">Nenhum artigo disponível</h3>
                <p className="text-gray-400">Novos ensinamentos serão publicados em breve</p>
              </div>
            )}
          </div>
        </div>

        {/* Mystical Quote */}
        <div className="floating-card max-w-2xl mx-auto mt-12 p-8 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="text-center">
            <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
            <p className="text-lg text-gray-300 italic leading-relaxed mb-4">
              "A verdadeira sabedoria nasce da união entre conhecimento e experiência"
            </p>
            <p className="text-amber-400 font-semibold">
              — Axioma da Gnose
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}