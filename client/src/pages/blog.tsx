import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, User, BookOpen, Search, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  category: string;
  featured: boolean;
}

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts'],
  });

  const { data: tags = [] } = useQuery<string[]>({
    queryKey: ['/api/blog/tags'],
  });

  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ['/api/blog/categories'],
  });

  // Filter posts based on search and filters
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag === null || post.tags.includes(selectedTag);
    const matchesCategory = selectedCategory === null || post.category === selectedCategory;
    
    return matchesSearch && matchesTag && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black">
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-800 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black">
      {/* Mystical Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-cinzel font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-500 to-red-400">
            GNOSIS ABISSAL
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            Portal de conhecimento público sobre luciferianismo ancestral, gnose ctônica 
            e os mistérios do Abismo. Artigos educativos para todos os buscadores sinceros 
            da sabedoria oculta.
          </p>
          
          {/* Mystical Divider */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent w-32"></div>
            <div className="mx-4 text-amber-500 text-2xl">❈</div>
            <div className="h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent w-32"></div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass-effect p-6 rounded-lg border border-purple-900/50 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar artigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/50 border-purple-900/50 text-white placeholder-gray-400"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-3 py-2 bg-black/50 border border-purple-900/50 rounded-md text-white"
            >
              <option value="">Todas as Categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedTag(null);
                setSelectedCategory(null);
              }}
              className="border-purple-900/50 text-gray-300 hover:bg-purple-900/20"
            >
              Limpar Filtros
            </Button>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      selectedTag === tag 
                        ? 'bg-purple-600 text-white' 
                        : 'border-purple-900/50 text-gray-300 hover:bg-purple-900/20'
                    }`}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-cinzel font-bold text-amber-400 mb-8 text-center">
              Artigos em Destaque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredPosts.map(post => (
                <Card key={post.id} className="glass-effect border-amber-900/50 hover:border-amber-700/70 transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-amber-600 text-black">Destaque</Badge>
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <CardTitle className="text-xl text-amber-400 group-hover:text-amber-300 transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-400">
                        <User className="w-4 h-4 mr-1" />
                        {post.author}
                        <Clock className="w-4 h-4 ml-4 mr-1" />
                        {post.readTime} min
                      </div>
                      <Button variant="ghost" className="text-amber-400 hover:text-amber-300">
                        Ler Artigo
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-4">
                      {post.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs border-purple-900/50 text-gray-400">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        <div>
          <h2 className="text-3xl font-cinzel font-bold text-purple-400 mb-8 text-center">
            Todos os Artigos
          </h2>
          
          {regularPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map(post => (
                <Card key={post.id} className="glass-effect border-purple-900/50 hover:border-purple-700/70 transition-all duration-300 group h-full flex flex-col">
                  <CardHeader className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="border-purple-900/50 text-gray-400">
                        {post.category}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <CardTitle className="text-lg text-purple-400 group-hover:text-purple-300 transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-400">
                        <User className="w-4 h-4 mr-1" />
                        {post.author}
                        <Clock className="w-4 h-4 ml-4 mr-1" />
                        {post.readTime} min
                      </div>
                      <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                        <BookOpen className="w-4 h-4 mr-1" />
                        Ler
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs border-purple-900/50 text-gray-400">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl text-gray-400 mb-2">Nenhum artigo encontrado</h3>
              <p className="text-gray-500">
                {searchTerm || selectedTag || selectedCategory 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Novos artigos serão publicados em breve'
                }
              </p>
            </div>
          )}
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-20 glass-effect p-8 rounded-lg border border-amber-900/50 text-center">
          <h3 className="text-2xl font-cinzel font-bold text-amber-400 mb-4">
            Receba Novos Artigos
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Inscreva-se para receber notificações sobre novos artigos sobre luciferianismo, 
            gnose e mistérios ocultos diretamente em seu email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Seu email..."
              className="bg-black/50 border-amber-900/50 text-white placeholder-gray-400"
            />
            <Button className="bg-amber-600 hover:bg-amber-700 text-black font-semibold">
              Inscrever-se
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}