import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Settings, 
  Users, 
  BookOpen, 
  Scroll, 
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Shield,
  Database,
  Activity,
  FileText,
  Image,
  Save,
  Eye,
  Upload,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  type: 'course' | 'grimoire' | 'page';
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  slug: string;
  difficulty_level: number;
  price_brl: string;
  status: 'draft' | 'published';
  created_at: string;
}

interface SiteStats {
  totalUsers: number;
  totalCourses: number;
  totalGrimoires: number;
  totalPages: number;
  totalRevenue: string;
}

export default function AdminControl() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showPageDialog, setShowPageDialog] = useState(false);
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch site statistics
  const { data: stats } = useQuery<SiteStats>({
    queryKey: ['/api/admin/stats'],
    queryFn: () => apiRequest('GET', '/api/admin/stats')
  });

  // Fetch pages
  const { data: pages = [] } = useQuery<Page[]>({
    queryKey: ['/api/admin/pages'],
    queryFn: () => apiRequest('GET', '/api/admin/pages')
  });

  // Fetch courses
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['/api/admin/courses'],
    queryFn: () => apiRequest('GET', '/api/admin/courses')
  });

  // Page mutations
  const createPageMutation = useMutation({
    mutationFn: (data: Partial<Page>) => apiRequest('POST', '/api/admin/pages', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
      setShowPageDialog(false);
      setEditingPage(null);
      toast({ title: "Página criada com sucesso!" });
    }
  });

  const updatePageMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<Page> & { id: number }) => 
      apiRequest('PUT', `/api/admin/pages/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
      setShowPageDialog(false);
      setEditingPage(null);
      toast({ title: "Página atualizada com sucesso!" });
    }
  });

  const deletePageMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/admin/pages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
      toast({ title: "Página removida com sucesso!" });
    }
  });

  // Course mutations
  const createCourseMutation = useMutation({
    mutationFn: (data: Partial<Course>) => apiRequest('POST', '/api/admin/courses', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      setShowCourseDialog(false);
      setEditingCourse(null);
      toast({ title: "Curso criado com sucesso!" });
    }
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<Course> & { id: number }) => 
      apiRequest('PUT', `/api/admin/courses/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      setShowCourseDialog(false);
      setEditingCourse(null);
      toast({ title: "Curso atualizado com sucesso!" });
    }
  });

  const deleteCourse = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/admin/courses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      toast({ title: "Curso removido com sucesso!" });
    }
  });

  const handleSavePage = (formData: FormData) => {
    const pageData = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      type: formData.get('type') as 'course' | 'grimoire' | 'page',
      status: formData.get('status') as 'draft' | 'published'
    };

    if (editingPage) {
      updatePageMutation.mutate({ ...pageData, id: editingPage.id });
    } else {
      createPageMutation.mutate(pageData);
    }
  };

  const handleSaveCourse = (formData: FormData) => {
    const courseData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      slug: formData.get('slug') as string,
      difficulty_level: parseInt(formData.get('difficulty_level') as string),
      price_brl: formData.get('price_brl') as string,
      status: formData.get('status') as 'draft' | 'published'
    };

    if (editingCourse) {
      updateCourseMutation.mutate({ ...courseData, id: editingCourse.id });
    } else {
      createCourseMutation.mutate(courseData);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fixed Central Rotating Seal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="rotating-seal w-96 h-96 opacity-10">
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
      <div className="relative z-10 min-h-screen px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-cinzel-decorative text-amber-400 mystical-glow mb-4">
              PAINEL ADMINISTRATIVO
            </h1>
            <div className="flex justify-center items-center space-x-8 text-amber-500 text-2xl">
              <span>☿</span>
              <span>⚹</span>
              <span>𖤍</span>
              <span>⚹</span>
              <span>☿</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-black/40 border border-amber-500/20">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-300">
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="pages" className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-300">
                <FileText className="w-4 h-4 mr-2" />
                Páginas
              </TabsTrigger>
              <TabsTrigger value="courses" className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-300">
                <BookOpen className="w-4 h-4 mr-2" />
                Cursos
              </TabsTrigger>
              <TabsTrigger value="grimoires" className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-300">
                <Scroll className="w-4 h-4 mr-2" />
                Grimórios
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-300">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="floating-card bg-black/40 border-amber-500/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Total Usuários</CardTitle>
                    <Users className="h-4 w-4 text-amber-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-400">
                      {stats?.totalUsers || 0}
                    </div>
                    <p className="text-xs text-gray-500">
                      Membros cadastrados
                    </p>
                  </CardContent>
                </Card>

                <Card className="floating-card bg-black/40 border-amber-500/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Cursos</CardTitle>
                    <BookOpen className="h-4 w-4 text-amber-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-400">
                      {stats?.totalCourses || 0}
                    </div>
                    <p className="text-xs text-gray-500">
                      Cursos ativos
                    </p>
                  </CardContent>
                </Card>

                <Card className="floating-card bg-black/40 border-amber-500/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Grimórios</CardTitle>
                    <Scroll className="h-4 w-4 text-amber-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-400">
                      {stats?.totalGrimoires || 0}
                    </div>
                    <p className="text-xs text-gray-500">
                      Textos disponíveis
                    </p>
                  </CardContent>
                </Card>

                <Card className="floating-card bg-black/40 border-amber-500/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Páginas</CardTitle>
                    <FileText className="h-4 w-4 text-amber-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-400">
                      {stats?.totalPages || 0}
                    </div>
                    <p className="text-xs text-gray-500">
                      Páginas publicadas
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Pages Management Tab */}
            <TabsContent value="pages" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-cinzel-decorative text-amber-300">Gerenciar Páginas</h2>
                <Button 
                  onClick={() => {
                    setEditingPage(null);
                    setShowPageDialog(true);
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-black"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Página
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {pages.map((page) => (
                  <Card key={page.id} className="floating-card bg-black/40 border-amber-500/30">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-amber-400">{page.title}</CardTitle>
                          <CardDescription className="text-gray-300">
                            /{page.slug} • {page.type}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                            {page.status === 'published' ? 'Publicado' : 'Rascunho'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingPage(page);
                              setShowPageDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deletePageMutation.mutate(page.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Courses Management Tab */}
            <TabsContent value="courses" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-cinzel-decorative text-amber-300">Gerenciar Cursos</h2>
                <Button 
                  onClick={() => {
                    setEditingCourse(null);
                    setShowCourseDialog(true);
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-black"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Curso
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {courses.map((course) => (
                  <Card key={course.id} className="floating-card bg-black/40 border-amber-500/30">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-amber-400">{course.title}</CardTitle>
                          <CardDescription className="text-gray-300">
                            Nível {course.difficulty_level} • R$ {course.price_brl}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                            {course.status === 'published' ? 'Publicado' : 'Rascunho'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingCourse(course);
                              setShowCourseDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCourse.mutate(course.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Grimoires Tab */}
            <TabsContent value="grimoires" className="space-y-6">
              <h2 className="text-2xl font-cinzel-decorative text-amber-300">Textos do Liber Prohibitus</h2>
              <p className="text-gray-400">
                Gerencie os textos sagrados e proibidos da biblioteca
              </p>
              
              <div className="floating-card p-6 bg-black/30 backdrop-blur-lg border border-red-500/20 rounded-xl text-center">
                <Scroll className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-xl text-gray-300">
                  Sistema de grimórios em desenvolvimento
                </p>
                <p className="text-gray-400 mt-2">
                  Em breve você poderá gerenciar todos os textos sagrados
                </p>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <h2 className="text-2xl font-cinzel-decorative text-amber-300">Configurações do Site</h2>
              
              <div className="floating-card p-6 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl text-center">
                <Settings className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <p className="text-xl text-gray-300">
                  Configurações gerais em desenvolvimento
                </p>
                <p className="text-gray-400 mt-2">
                  Em breve você poderá personalizar todas as configurações
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Page Edit Dialog */}
      <Dialog open={showPageDialog} onOpenChange={setShowPageDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-black/90 border-amber-500/30">
          <DialogHeader>
            <DialogTitle className="text-amber-400">
              {editingPage ? 'Editar Página' : 'Nova Página'}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              {editingPage ? 'Modifique o conteúdo da página' : 'Crie uma nova página para o site'}
            </DialogDescription>
          </DialogHeader>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSavePage(new FormData(e.target as HTMLFormElement));
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-gray-300">Título</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingPage?.title || ''}
                  className="bg-black/50 border-amber-500/30 text-white"
                  placeholder="Título da página"
                />
              </div>
              <div>
                <Label htmlFor="slug" className="text-gray-300">URL (slug)</Label>
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={editingPage?.slug || ''}
                  className="bg-black/50 border-amber-500/30 text-white"
                  placeholder="url-da-pagina"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type" className="text-gray-300">Tipo</Label>
                <Select name="type" defaultValue={editingPage?.type || 'page'}>
                  <SelectTrigger className="bg-black/50 border-amber-500/30 text-white">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="page">Página</SelectItem>
                    <SelectItem value="course">Curso</SelectItem>
                    <SelectItem value="grimoire">Grimório</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status" className="text-gray-300">Status</Label>
                <Select name="status" defaultValue={editingPage?.status || 'draft'}>
                  <SelectTrigger className="bg-black/50 border-amber-500/30 text-white">
                    <SelectValue placeholder="Status da página" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="content" className="text-gray-300">Conteúdo</Label>
              <Textarea
                id="content"
                name="content"
                defaultValue={editingPage?.content || ''}
                className="bg-black/50 border-amber-500/30 text-white min-h-[300px]"
                placeholder="Conteúdo da página em HTML ou Markdown"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowPageDialog(false)}
                className="border-amber-500/30 text-amber-300"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-amber-600 hover:bg-amber-700 text-black"
                disabled={createPageMutation.isPending || updatePageMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Course Edit Dialog */}
      <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
        <DialogContent className="max-w-2xl bg-black/90 border-amber-500/30">
          <DialogHeader>
            <DialogTitle className="text-amber-400">
              {editingCourse ? 'Editar Curso' : 'Novo Curso'}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              {editingCourse ? 'Modifique as informações do curso' : 'Crie um novo curso'}
            </DialogDescription>
          </DialogHeader>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveCourse(new FormData(e.target as HTMLFormElement));
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="course-title" className="text-gray-300">Título do Curso</Label>
              <Input
                id="course-title"
                name="title"
                defaultValue={editingCourse?.title || ''}
                className="bg-black/50 border-amber-500/30 text-white"
                placeholder="Nome do curso"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="course-slug" className="text-gray-300">URL (slug)</Label>
                <Input
                  id="course-slug"
                  name="slug"
                  defaultValue={editingCourse?.slug || ''}
                  className="bg-black/50 border-amber-500/30 text-white"
                  placeholder="url-do-curso"
                />
              </div>
              <div>
                <Label htmlFor="difficulty" className="text-gray-300">Nível de Dificuldade</Label>
                <Select name="difficulty_level" defaultValue={editingCourse?.difficulty_level?.toString() || '1'}>
                  <SelectTrigger className="bg-black/50 border-amber-500/30 text-white">
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Iniciante</SelectItem>
                    <SelectItem value="2">Intermediário</SelectItem>
                    <SelectItem value="3">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="text-gray-300">Preço (R$)</Label>
                <Input
                  id="price"
                  name="price_brl"
                  type="number"
                  step="0.01"
                  defaultValue={editingCourse?.price_brl || ''}
                  className="bg-black/50 border-amber-500/30 text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="course-status" className="text-gray-300">Status</Label>
                <Select name="status" defaultValue={editingCourse?.status || 'draft'}>
                  <SelectTrigger className="bg-black/50 border-amber-500/30 text-white">
                    <SelectValue placeholder="Status do curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="course-description" className="text-gray-300">Descrição</Label>
              <Textarea
                id="course-description"
                name="description"
                defaultValue={editingCourse?.description || ''}
                className="bg-black/50 border-amber-500/30 text-white min-h-[150px]"
                placeholder="Descrição detalhada do curso"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowCourseDialog(false)}
                className="border-amber-500/30 text-amber-300"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-amber-600 hover:bg-amber-700 text-black"
                disabled={createCourseMutation.isPending || updateCourseMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}