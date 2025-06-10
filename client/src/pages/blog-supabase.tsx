import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Eye, BookOpen, Feather } from "lucide-react";
// import SiteNavigation from "../components/SiteNavigation";
import Footer from "../components/footer";
import { useToast } from "../hooks/use-toast";
import { useBlogPosts, useNewsletterSubscription } from "@/hooks/useSupabaseData";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  slug: string;
  category: string;
  tags: string[];
  published: boolean;
  featured_image?: string;
  created_at: string;
  updated_at: string;
}

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Fetch blog posts using Supabase
  const { data: posts = [], isLoading } = useBlogPosts();

  // Newsletter subscription using Supabase
  const subscribeToNewsletter = useNewsletterSubscription();

  // Filter posts based on search and category
  const filteredPosts = posts.filter((post: BlogPost) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ["Todos", ...Array.from(new Set(posts.map((post: BlogPost) => post.category)))];

  // Newsletter subscription form
  function NewsletterForm() {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email) return;

      try {
        await subscribeToNewsletter.mutateAsync(email);
        toast({
          title: "Inscrição realizada!",
          description: "Você receberá novos artigos em seu email.",
        });
        setEmail('');
      } catch (error) {
        toast({
          title: "Erro na inscrição",
          description: "Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    };

    return (
      <Card className="bg-black/40 border-gold/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-gold font-cinzel-decorative flex items-center gap-2">
            <Feather className="w-5 h-5" />
            Mensageiro das Trevas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4 font-crimson">
            Receba os novos pergaminhos de sabedoria diretamente em sua caixa mystical.
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Seu email sagrado"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/20 border-gold/20 text-gold placeholder:text-gray-500"
              required
            />
            <Button 
              type="submit"
              disabled={subscribeToNewsletter.isPending}
              className="w-full bg-gradient-to-r from-gold/80 to-orange-600/80 hover:from-gold hover:to-orange-600 text-black font-cinzel-regular"
            >
              {subscribeToNewsletter.isPending ? "Invocando..." : "Inscrever-se"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950">
      <SiteNavigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-cinzel-decorative text-gold mb-4">
            Chronicas do Abismo
          </h1>
          <p className="text-xl text-gray-300 font-crimson max-w-2xl mx-auto">
            Conhecimentos ancestrais e sabedoria luciferiana para os iniciados
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <Card className="bg-black/40 border-gold/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gold font-cinzel-decorative text-lg">
                  Buscar Pergaminhos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Buscar conhecimento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/20 border-gold/20 text-gold placeholder:text-gray-500"
                />
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="bg-black/40 border-gold/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gold font-cinzel-decorative text-lg">
                  Categorias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded transition-colors font-crimson ${
                        selectedCategory === category
                          ? 'bg-gold/20 text-gold'
                          : 'text-gray-300 hover:bg-gold/10 hover:text-gold'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <NewsletterForm />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-black/40 border-gold/20 backdrop-blur-sm">
                    <CardHeader className="space-y-2">
                      <div className="h-4 bg-gray-700 rounded animate-pulse" />
                      <div className="h-3 bg-gray-700 rounded w-3/4 animate-pulse" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-700 rounded animate-pulse" />
                        <div className="h-3 bg-gray-700 rounded animate-pulse" />
                        <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredPosts.map((post: BlogPost) => (
                  <Card key={post.id} className="bg-black/40 border-gold/20 backdrop-blur-sm hover:border-gold/40 transition-all group">
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.created_at).toLocaleDateString('pt-BR')}
                        <Badge variant="outline" className="border-gold/30 text-gold">
                          {post.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-gold font-cinzel-decorative group-hover:text-orange-400 transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 font-crimson mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400 font-crimson">
                          Por {post.author}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-gold hover:text-orange-400 hover:bg-gold/10"
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Ler mais
                        </Button>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="text-xs bg-gray-800 text-gray-300"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-black/40 border-gold/20 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-cinzel-decorative text-gray-400 mb-2">
                    Nenhum pergaminho encontrado
                  </h3>
                  <p className="text-gray-500 font-crimson">
                    Tente ajustar seus filtros de busca ou categoria
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}