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

  // Check if user is admin
  if (!user?.is_admin) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Shield className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-500 mb-2">Acesso Negado</h1>
        <p className="text-gray-400">Você não tem permissão para acessar o painel administrativo.</p>
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
    mutationFn: (courseData: typeof newCourse) => 
      apiRequest('/api/admin/courses', 'POST', courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      setNewCourse({ title: '', description: '', level: 1, content: '' });
      toast({
        title: "Curso criado com sucesso!",
        description: "O novo curso foi adicionado ao sistema.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar curso",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    }
  });

  // Create grimoire mutation
  const createGrimoireMutation = useMutation({
    mutationFn: (grimoireData: typeof newGrimoire) => 
      apiRequest('/api/admin/grimoires', 'POST', grimoireData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/grimoires'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      setNewGrimoire({ title: '', description: '', content: '', price: 0 });
      toast({
        title: "Grimório criado com sucesso!",
        description: "O novo grimório foi adicionado ao sistema.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar grimório",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    }
  });

  // Generate content with AI
  const generateCourseMutation = useMutation({
    mutationFn: ({ level, topic }: { level: number; topic: string }) =>
      apiRequest('/api/generate/course', 'POST', { level, topic }),
    onSuccess: (data) => {
      setNewCourse(prev => ({
        ...prev,
        title: data.content.title,
        description: data.content.description,
        content: JSON.stringify(data.content.modules)
      }));
      toast({
        title: "Conteúdo gerado!",
        description: "O curso foi gerado pela IA. Revise e ajuste conforme necessário.",
      });
    }
  });

  const generateGrimoireMutation = useMutation({
    mutationFn: (title: string) =>
      apiRequest('/api/generate/grimoire', 'POST', { title }),
    onSuccess: (data) => {
      setNewGrimoire(prev => ({
        ...prev,
        title: data.content.title,
        description: data.content.description,
        content: JSON.stringify(data.content.chapters)
      }));
      toast({
        title: "Grimório gerado!",
        description: "O grimório foi gerado pela IA. Revise e ajuste conforme necessário.",
      });
    }
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.description) {
      toast({
        title: "Erro",
        description: "Título e descrição são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    createCourseMutation.mutate(newCourse);
  };

  const handleCreateGrimoire = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrimoire.title || !newGrimoire.description) {
      toast({
        title: "Erro",
        description: "Título e descrição são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    createGrimoireMutation.mutate(newGrimoire);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent mb-2">
          Painel Administrativo
        </h1>
        <p className="text-gray-400">Gerencie o conteúdo e usuários do Templo do Abismo</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-900/50 border-amber-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Usuários</CardTitle>
            <Users className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.users || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-amber-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Cursos</CardTitle>
            <BookOpen className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.courses || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-amber-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Grimórios</CardTitle>
            <Scroll className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.grimoires || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-amber-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Consultas</CardTitle>
            <BarChart3 className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.consultations || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900">
          <TabsTrigger value="courses" className="data-[state=active]:bg-amber-900/30">
            Cursos
          </TabsTrigger>
          <TabsTrigger value="grimoires" className="data-[state=active]:bg-amber-900/30">
            Grimórios
          </TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          <Card className="bg-gray-900/50 border-amber-800/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Criar Novo Curso</CardTitle>
              <CardDescription>
                Adicione um novo curso ao sistema ou gere conteúdo com IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseTitle">Título</Label>
                    <Input
                      id="courseTitle"
                      value={newCourse.title}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-gray-800 border-amber-800/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="courseLevel">Nível</Label>
                    <Input
                      id="courseLevel"
                      type="number"
                      min="1"
                      max="10"
                      value={newCourse.level}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                      className="bg-gray-800 border-amber-800/30"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courseDescription">Descrição</Label>
                  <Textarea
                    id="courseDescription"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-gray-800 border-amber-800/30"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courseContent">Conteúdo (JSON)</Label>
                  <Textarea
                    id="courseContent"
                    value={newCourse.content}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, content: e.target.value }))}
                    className="bg-gray-800 border-amber-800/30"
                    rows={5}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    disabled={createCourseMutation.isPending}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Curso
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const topic = prompt("Digite o tópico do curso:");
                      if (topic) {
                        generateCourseMutation.mutate({ level: newCourse.level, topic });
                      }
                    }}
                    disabled={generateCourseMutation.isPending}
                    className="border-amber-600 text-amber-400 hover:bg-amber-900/20"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Gerar com IA
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Courses List */}
          <Card className="bg-gray-900/50 border-amber-800/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Cursos Existentes</CardTitle>
            </CardHeader>
            <CardContent>
              {coursesLoading ? (
                <div className="text-center py-4">Carregando cursos...</div>
              ) : (
                <div className="space-y-2">
                  {courses?.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded border border-amber-800/20"
                    >
                      <div>
                        <h3 className="font-medium text-white">{course.title}</h3>
                        <p className="text-sm text-gray-400">Nível {course.level}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded ${course.is_published ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
                          {course.is_published ? 'Publicado' : 'Rascunho'}
                        </span>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grimoires Tab */}
        <TabsContent value="grimoires" className="space-y-6">
          <Card className="bg-gray-900/50 border-amber-800/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Criar Novo Grimório</CardTitle>
              <CardDescription>
                Adicione um novo grimório ao sistema ou gere conteúdo com IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateGrimoire} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="grimoireTitle">Título</Label>
                    <Input
                      id="grimoireTitle"
                      value={newGrimoire.title}
                      onChange={(e) => setNewGrimoire(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-gray-800 border-amber-800/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grimoirePrice">Preço</Label>
                    <Input
                      id="grimoirePrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newGrimoire.price}
                      onChange={(e) => setNewGrimoire(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                      className="bg-gray-800 border-amber-800/30"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grimoireDescription">Descrição</Label>
                  <Textarea
                    id="grimoireDescription"
                    value={newGrimoire.description}
                    onChange={(e) => setNewGrimoire(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-gray-800 border-amber-800/30"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grimoireContent">Conteúdo (JSON)</Label>
                  <Textarea
                    id="grimoireContent"
                    value={newGrimoire.content}
                    onChange={(e) => setNewGrimoire(prev => ({ ...prev, content: e.target.value }))}
                    className="bg-gray-800 border-amber-800/30"
                    rows={5}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    disabled={createGrimoireMutation.isPending}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Grimório
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const title = prompt("Digite o título do grimório:");
                      if (title) {
                        generateGrimoireMutation.mutate(title);
                      }
                    }}
                    disabled={generateGrimoireMutation.isPending}
                    className="border-amber-600 text-amber-400 hover:bg-amber-900/20"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Gerar com IA
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Grimoires List */}
          <Card className="bg-gray-900/50 border-amber-800/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Grimórios Existentes</CardTitle>
            </CardHeader>
            <CardContent>
              {grimoiresLoading ? (
                <div className="text-center py-4">Carregando grimórios...</div>
              ) : (
                <div className="space-y-2">
                  {grimoires?.map((grimoire) => (
                    <div
                      key={grimoire.id}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded border border-amber-800/20"
                    >
                      <div>
                        <h3 className="font-medium text-white">{grimoire.title}</h3>
                        <p className="text-sm text-gray-400">R$ {grimoire.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded ${grimoire.is_published ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
                          {grimoire.is_published ? 'Publicado' : 'Rascunho'}
                        </span>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;