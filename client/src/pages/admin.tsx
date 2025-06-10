import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import {
  Shield,
  Users,
  BookOpen,
  Scroll,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  Sparkles
} from 'lucide-react';

interface AdminStats {
  users: number;
  courses: number;
  grimoires: number;
  consultations: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  level: number;
  is_published: boolean;
  created_at: string;
}

interface Grimoire {
  id: number;
  title: string;
  description: string;
  price: number;
  is_published: boolean;
  created_at: string;
}

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Check for emergency admin session
  const emergencyAdmin = localStorage.getItem('emergency-admin');
  const emergencyUser = emergencyAdmin ? JSON.parse(emergencyAdmin) : null;
  
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    level: 1,
    content: ''
  });
  
  const [newGrimoire, setNewGrimoire] = useState({
    title: '',
    description: '',
    content: '',
    price: 0
  });

  // Check if user is logged in
  if (!user) {
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

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <div className="floating-card p-8 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl text-center max-w-md">
            <Shield className="w-16 h-16 mx-auto text-amber-400 mb-4" />
            <h1 className="text-3xl font-cinzel-decorative text-amber-400 mystical-glow mb-4">
              SANCTUM ADMINISTRATORIS
            </h1>
            <p className="text-gray-300 mb-6">
              Acesso restrito aos mestres do templo. Faça login para continuar.
            </p>
            <div className="space-y-4">
              <a href="/login">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-black">
                  Entrar no Sanctum
                </Button>
              </a>
              <a href="/register">
                <Button variant="outline" className="w-full border-amber-500/30 text-amber-300 hover:bg-amber-500/10">
                  Registrar-se
                </Button>
              </a>
            </div>
            <div className="text-amber-400 text-2xl mt-6">𖤍 ⸸ 𖤍</div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is admin (normal login or emergency admin)
  const isAdmin = (user?.role === 'admin') || (emergencyUser?.role === 'admin');
  const currentUser = user || emergencyUser;
  
  if (!isAdmin) {
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

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <div className="floating-card p-8 bg-black/30 backdrop-blur-lg border border-red-500/20 rounded-xl text-center max-w-md">
            <Shield className="w-16 h-16 mx-auto text-red-400 mb-4" />
            <h1 className="text-3xl font-cinzel-decorative text-red-400 mystical-glow mb-4">
              ACCESSUS DENEGATUS
            </h1>
            <p className="text-gray-300 mb-4">
              Olá <strong className="text-amber-400">{currentUser?.username || 'visitante'}</strong>, você não possui as permissões necessárias para acessar o sanctum administrativo.
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Apenas mestres do templo com privilégios administrativos podem acessar esta área.
            </p>
            <a href="/">
              <Button className="bg-amber-600 hover:bg-amber-700 text-black">
                Retornar ao Templo
              </Button>
            </a>
            <div className="text-red-400 text-2xl mt-6">⛧ ⸸ ⛧</div>
          </div>
        </div>
      </div>
    );
  }

  // Fetch admin stats
  const { data: stats } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
    queryFn: () => apiRequest('/api/admin/stats')
  });

  // Fetch courses
  const { data: courses, isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ['/api/admin/courses'],
    queryFn: () => apiRequest('/api/admin/courses')
  });

  // Fetch grimoires
  const { data: grimoires, isLoading: grimoiresLoading } = useQuery<Grimoire[]>({
    queryKey: ['/api/admin/grimoires'],
    queryFn: () => apiRequest('/api/admin/grimoires')
  });

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: (courseData: typeof newCourse) => apiRequest('/api/admin/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
      headers: { 'Content-Type': 'application/json' }
    }),
    onSuccess: () => {
      toast({
        title: "Curso criado",
        description: "O curso foi criado com sucesso.",
      });
      setNewCourse({ title: '', description: '', level: 1, content: '' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao criar curso.",
        variant: "destructive",
      });
    }
  });

  // Create grimoire mutation
  const createGrimoireMutation = useMutation({
    mutationFn: (grimoireData: typeof newGrimoire) => apiRequest('/api/admin/grimoires', {
      method: 'POST',
      body: JSON.stringify(grimoireData),
      headers: { 'Content-Type': 'application/json' }
    }),
    onSuccess: () => {
      toast({
        title: "Grimório criado",
        description: "O grimório foi criado com sucesso.",
      });
      setNewGrimoire({ title: '', description: '', content: '', price: 0 });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/grimoires'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao criar grimório.",
        variant: "destructive",
      });
    }
  });

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
        <div className="text-center mb-12 max-w-4xl">
          <div className="mb-8">
            <div className="text-amber-400 text-6xl mb-4">⚡</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              SANCTUM ADMINISTRARE
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
              Portal de Controle do Templo
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              Gerencie o <strong className="text-amber-400">conhecimento sagrado</strong>, administre os 
              <strong className="text-red-400"> rituais digitais</strong> e supervisione a evolução dos iniciados.
            </p>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Potentia in Administratione"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                Poder na administração
              </p>
            </div>
          </div>
        </div>

        {/* Admin Stats */}
        {stats && (
          <div className="floating-card max-w-6xl w-full mb-8 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
            <div className="p-6">
              <h3 className="text-2xl font-cinzel-decorative text-amber-300 mb-6 text-center">
                Métricas do Templo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <Users className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                  <h4 className="text-lg font-cinzel-decorative text-amber-300">Iniciados</h4>
                  <p className="text-2xl font-bold text-amber-400">{stats.users}</p>
                  <p className="text-sm text-gray-400">Usuários registrados</p>
                </div>
                
                <div className="text-center">
                  <BookOpen className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                  <h4 className="text-lg font-cinzel-decorative text-amber-300">Cursos</h4>
                  <p className="text-2xl font-bold text-amber-400">{stats.courses}</p>
                  <p className="text-sm text-gray-400">Ensinamentos disponíveis</p>
                </div>
                
                <div className="text-center">
                  <Scroll className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                  <h4 className="text-lg font-cinzel-decorative text-amber-300">Grimórios</h4>
                  <p className="text-2xl font-bold text-amber-400">{stats.grimoires}</p>
                  <p className="text-sm text-gray-400">Tomos arcanos</p>
                </div>
                
                <div className="text-center">
                  <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                  <h4 className="text-lg font-cinzel-decorative text-amber-300">Consultas</h4>
                  <p className="text-2xl font-bold text-amber-400">{stats.consultations}</p>
                  <p className="text-sm text-gray-400">Oráculos realizados</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Tools */}
        <div className="floating-card max-w-6xl w-full bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black/40 border border-amber-600/30">
              <TabsTrigger 
                value="courses"
                className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200 text-gray-400"
              >
                Cursos
              </TabsTrigger>
              <TabsTrigger 
                value="grimoires"
                className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200 text-gray-400"
              >
                Grimórios
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200 text-gray-400"
              >
                Análises
              </TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-cinzel-decorative text-amber-300">Gerenciar Cursos</h3>
                  <Button className="bg-amber-600 hover:bg-amber-700 text-black">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Curso
                  </Button>
                </div>

                {/* Create Course Form */}
                <Card className="bg-black/20 border-amber-500/20">
                  <CardHeader>
                    <CardTitle className="text-amber-400">Criar Novo Curso</CardTitle>
                    <CardDescription className="text-gray-300">
                      Adicione um novo ensinamento ao templo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="courseTitle" className="text-amber-300">Título</Label>
                        <Input
                          id="courseTitle"
                          value={newCourse.title}
                          onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                          className="bg-black/40 border-amber-500/30 text-gray-300"
                          placeholder="Nome do curso"
                        />
                      </div>
                      <div>
                        <Label htmlFor="courseLevel" className="text-amber-300">Nível</Label>
                        <Input
                          id="courseLevel"
                          type="number"
                          value={newCourse.level}
                          onChange={(e) => setNewCourse({...newCourse, level: parseInt(e.target.value)})}
                          className="bg-black/40 border-amber-500/30 text-gray-300"
                          min="1"
                          max="10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="courseDescription" className="text-amber-300">Descrição</Label>
                      <Textarea
                        id="courseDescription"
                        value={newCourse.description}
                        onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                        className="bg-black/40 border-amber-500/30 text-gray-300"
                        placeholder="Descrição do curso"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="courseContent" className="text-amber-300">Conteúdo</Label>
                      <Textarea
                        id="courseContent"
                        value={newCourse.content}
                        onChange={(e) => setNewCourse({...newCourse, content: e.target.value})}
                        className="bg-black/40 border-amber-500/30 text-gray-300"
                        placeholder="Conteúdo detalhado do curso"
                        rows={6}
                      />
                    </div>
                    <Button 
                      onClick={() => createCourseMutation.mutate(newCourse)}
                      disabled={createCourseMutation.isPending}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-black"
                    >
                      {createCourseMutation.isPending ? "Criando..." : "Criar Curso"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Courses List */}
                <div className="space-y-4">
                  <h4 className="text-xl font-cinzel-decorative text-amber-300">Cursos Existentes</h4>
                  {coursesLoading ? (
                    <div className="text-center text-gray-400">Carregando cursos...</div>
                  ) : courses && courses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {courses.map((course) => (
                        <Card key={course.id} className="bg-black/20 border-amber-500/20">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="text-lg font-semibold text-amber-400">{course.title}</h5>
                                <p className="text-gray-300 text-sm">{course.description}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-xs text-gray-400">Nível {course.level}</span>
                                  <span className="text-xs text-gray-400">
                                    {course.is_published ? "✓ Publicado" : "○ Rascunho"}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    Criado em {new Date(course.created_at).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-300">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-300">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" className="border-red-500/30 text-red-300">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Nenhum curso criado ainda</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="grimoires" className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-cinzel-decorative text-amber-300">Gerenciar Grimórios</h3>
                  <Button className="bg-amber-600 hover:bg-amber-700 text-black">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Grimório
                  </Button>
                </div>

                {/* Create Grimoire Form */}
                <Card className="bg-black/20 border-amber-500/20">
                  <CardHeader>
                    <CardTitle className="text-amber-400">Criar Novo Grimório</CardTitle>
                    <CardDescription className="text-gray-300">
                      Adicione um novo tomo arcano à biblioteca
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="grimoireTitle" className="text-amber-300">Título</Label>
                        <Input
                          id="grimoireTitle"
                          value={newGrimoire.title}
                          onChange={(e) => setNewGrimoire({...newGrimoire, title: e.target.value})}
                          className="bg-black/40 border-amber-500/30 text-gray-300"
                          placeholder="Nome do grimório"
                        />
                      </div>
                      <div>
                        <Label htmlFor="grimoirePrice" className="text-amber-300">Preço (R$)</Label>
                        <Input
                          id="grimoirePrice"
                          type="number"
                          value={newGrimoire.price}
                          onChange={(e) => setNewGrimoire({...newGrimoire, price: parseFloat(e.target.value)})}
                          className="bg-black/40 border-amber-500/30 text-gray-300"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="grimoireDescription" className="text-amber-300">Descrição</Label>
                      <Textarea
                        id="grimoireDescription"
                        value={newGrimoire.description}
                        onChange={(e) => setNewGrimoire({...newGrimoire, description: e.target.value})}
                        className="bg-black/40 border-amber-500/30 text-gray-300"
                        placeholder="Descrição do grimório"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="grimoireContent" className="text-amber-300">Conteúdo</Label>
                      <Textarea
                        id="grimoireContent"
                        value={newGrimoire.content}
                        onChange={(e) => setNewGrimoire({...newGrimoire, content: e.target.value})}
                        className="bg-black/40 border-amber-500/30 text-gray-300"
                        placeholder="Conteúdo completo do grimório"
                        rows={8}
                      />
                    </div>
                    <Button 
                      onClick={() => createGrimoireMutation.mutate(newGrimoire)}
                      disabled={createGrimoireMutation.isPending}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-black"
                    >
                      {createGrimoireMutation.isPending ? "Criando..." : "Criar Grimório"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Grimoires List */}
                <div className="space-y-4">
                  <h4 className="text-xl font-cinzel-decorative text-amber-300">Grimórios Existentes</h4>
                  {grimoiresLoading ? (
                    <div className="text-center text-gray-400">Carregando grimórios...</div>
                  ) : grimoires && grimoires.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {grimoires.map((grimoire) => (
                        <Card key={grimoire.id} className="bg-black/20 border-amber-500/20">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="text-lg font-semibold text-amber-400">{grimoire.title}</h5>
                                <p className="text-gray-300 text-sm">{grimoire.description}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-xs text-gray-400">R$ {grimoire.price.toFixed(2)}</span>
                                  <span className="text-xs text-gray-400">
                                    {grimoire.is_published ? "✓ Publicado" : "○ Rascunho"}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    Criado em {new Date(grimoire.created_at).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-300">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-300">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" className="border-red-500/30 text-red-300">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <Scroll className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Nenhum grimório criado ainda</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="p-6">
              <div className="space-y-6">
                <h3 className="text-2xl font-cinzel-decorative text-amber-300 text-center">
                  Análises do Templo
                </h3>
                
                <div className="text-center">
                  <BarChart3 className="w-24 h-24 mx-auto text-amber-400 opacity-50 mb-4" />
                  <p className="text-gray-400">
                    Análises detalhadas em desenvolvimento...
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Em breve: gráficos de engajamento, relatórios de vendas e métricas avançadas
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Mystical Quote */}
        <div className="floating-card max-w-2xl mx-auto mt-12 p-8 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="text-center">
            <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
            <p className="text-lg text-gray-300 italic leading-relaxed mb-4">
              "Com grande poder vem a responsabilidade de moldar o destino espiritual dos outros"
            </p>
            <p className="text-amber-400 font-semibold">
              — Código do Administrador
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;