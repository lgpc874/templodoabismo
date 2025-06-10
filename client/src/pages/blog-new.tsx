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
  },
  {
    id: 4,
    title: "Meditação Abissal: Técnicas Avançadas",
    excerpt: "Métodos profundos de meditação para acessar os níveis mais profundos da consciência e conectar-se com as forças primordiais.",
    author: "Hierofante Asmodeus",
    slug: "meditacao-abissal-tecnicas",
    category: "Meditação",
    tags: ["meditação", "consciência", "técnicas"],
    featured_image: "/blog4.jpg",
    created_at: "2024-02-01"
  },
  {
    id: 5,
    title: "História dos Templos Luciferianos",
    excerpt: "Uma jornada através da história dos templos e organizações luciferianas ao longo dos séculos.",
    author: "Suma Sacerdotisa Hecate",
    slug: "historia-templos-luciferianos",
    category: "História",
    tags: ["história", "templos", "tradição"],
    featured_image: "/blog5.jpg",
    created_at: "2024-02-05"
  },
  {
    id: 6,
    title: "Alquimia Espiritual: Transformação Interior",
    excerpt: "Os princípios da alquimia aplicados ao desenvolvimento espiritual e à transformação da consciência.",
    author: "Adepto Belial",
    slug: "alquimia-espiritual-transformacao",
    category: "Alquimia",
    tags: ["alquimia", "transformação", "espiritual"],
    featured_image: "/blog6.jpg",
    created_at: "2024-02-10"
  }
];

export default function Blog() {
  const { data: posts = mockPosts, isLoading } = useQuery({
    queryKey: ["/api/blog/posts"]
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-amber-500 animate-pulse text-xl">Carregando artigos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-amber-500 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-orange-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse opacity-25"></div>
        <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-amber-600 rounded-full animate-pulse opacity-35"></div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto text-center py-16">
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 mb-6 animate-title-float font-cinzel">
          Vox Abyssi
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto animate-mystical-float">
          Mergulhe nos ensinamentos ancestrais através de artigos, reflexões e insights sobre a tradição luciferiana e os mistérios do caminho da gnose
        </p>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: BlogPost) => (
            <Card 
              key={post.id}
              className="bg-gradient-to-b from-gray-900/50 to-black/50 border-2 border-gray-600 hover:border-amber-600 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
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
                    <BookOpen className="w-16 h-16 text-amber-500 animate-mystical-float" />
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
                
                <CardTitle className="text-amber-200 text-lg font-cinzel animate-mystical-float line-clamp-2">
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

        {posts.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-mystical-float" />
            <h3 className="text-xl text-amber-200 mb-2 font-cinzel">Nenhum artigo disponível</h3>
            <p className="text-gray-400">Novos ensinamentos serão publicados em breve</p>
          </div>
        )}
      </div>

      {/* Mystical Quote */}
      <div className="max-w-4xl mx-auto text-center py-16">
        <p className="text-gray-500 text-lg italic animate-mystical-float">
          "A verdadeira sabedoria nasce da união entre conhecimento e experiência"
        </p>
      </div>
    </div>
  );
}