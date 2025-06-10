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
// import SiteNavigation from "@/components/SiteNavigation";

export default function AdminControl() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingPage, setEditingPage] = useState<any>(null);
  const [editingScripture, setEditingScripture] = useState<any>(null);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [showPageDialog, setShowPageDialog] = useState(false);
  const [showScriptureDialog, setShowScriptureDialog] = useState(false);
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [showMediaDialog, setShowMediaDialog] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries para carregar dados reais
  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    retry: false,
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    retry: false,
  });

  const { data: pages = [], isLoading: pagesLoading } = useQuery({
    queryKey: ["/api/admin/pages"],
    retry: false,
  });

  const { data: scriptures = [], isLoading: scripturesLoading } = useQuery({
    queryKey: ["/api/admin/scriptures"],
    retry: false,
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/admin/courses"],
    retry: false,
  });

  const { data: media = [], isLoading: mediaLoading } = useQuery({
    queryKey: ["/api/admin/media"],
    retry: false,
  });

  // Mutations para operações CRUD
  const createPageMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/admin/pages", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      toast({ title: "Página criada com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pages"] });
      setShowPageDialog(false);
      setEditingPage(null);
    },
    onError: () => {
      toast({ title: "Erro ao criar página", variant: "destructive" });
    },
  });

  const updatePageMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest(`/api/admin/pages/${id}`, {
        method: "PUT", 
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Página atualizada com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pages"] });
      setShowPageDialog(false);
      setEditingPage(null);
    },
    onError: () => {
      toast({ title: "Erro ao atualizar página", variant: "destructive" });
    },
  });

  const deletePageMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/pages/${id}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      toast({ title: "Página deletada com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pages"] });
    },
    onError: () => {
      toast({ title: "Erro ao deletar página", variant: "destructive" });
    },
  });

  const publishPageMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/pages/${id}/publish`, {
      method: "POST",
    }),
    onSuccess: () => {
      toast({ title: "Página publicada com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pages"] });
    },
    onError: () => {
      toast({ title: "Erro ao publicar página", variant: "destructive" });
    },
  });

  // Scripture mutations
  const createScriptureMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/admin/scriptures", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      toast({ title: "Escritura criada com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/scriptures"] });
      setShowScriptureDialog(false);
      setEditingScripture(null);
    },
    onError: () => {
      toast({ title: "Erro ao criar escritura", variant: "destructive" });
    },
  });

  const updateScriptureMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest(`/api/admin/scriptures/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Escritura atualizada com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/scriptures"] });
      setShowScriptureDialog(false);
      setEditingScripture(null);
    },
    onError: () => {
      toast({ title: "Erro ao atualizar escritura", variant: "destructive" });
    },
  });

  const deleteScriptureMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/scriptures/${id}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      toast({ title: "Escritura deletada com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/scriptures"] });
    },
    onError: () => {
      toast({ title: "Erro ao deletar escritura", variant: "destructive" });
    },
  });

  // Course mutations
  const createCourseMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/admin/courses", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      toast({ title: "Curso criado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
      setShowCourseDialog(false);
      setEditingCourse(null);
    },
    onError: () => {
      toast({ title: "Erro ao criar curso", variant: "destructive" });
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest(`/api/admin/courses/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Curso atualizado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
      setShowCourseDialog(false);
      setEditingCourse(null);
    },
    onError: () => {
      toast({ title: "Erro ao atualizar curso", variant: "destructive" });
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/courses/${id}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      toast({ title: "Curso deletado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
    },
    onError: () => {
      toast({ title: "Erro ao deletar curso", variant: "destructive" });
    },
  });

  // Media upload mutation
  const uploadMediaMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiRequest("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: () => {
      toast({ title: "Mídia enviada com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      setShowMediaDialog(false);
    },
    onError: () => {
      toast({ title: "Erro ao enviar mídia", variant: "destructive" });
    },
  });

  const deleteMediaMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/media/${id}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      toast({ title: "Mídia deletada com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
    },
    onError: () => {
      toast({ title: "Erro ao deletar mídia", variant: "destructive" });
    },
  });

  // Handlers for form submissions
  const handlePageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      content: formData.get('content'),
      status: formData.get('status') || 'draft',
      type: formData.get('type') || 'page',
    };

    if (editingPage) {
      updatePageMutation.mutate({ id: editingPage.id, data });
    } else {
      createPageMutation.mutate(data);
    }
  };

  const handleScriptureSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      content: formData.get('content'),
      chapter: parseInt(formData.get('chapter') as string) || 1,
      verse: parseInt(formData.get('verse') as string) || 1,
      category: formData.get('category'),
      status: formData.get('status') || 'draft',
    };

    if (editingScripture) {
      updateScriptureMutation.mutate({ id: editingScripture.id, data });
    } else {
      createScriptureMutation.mutate(data);
    }
  };

  const handleCourseSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      level: parseInt(formData.get('level') as string) || 1,
      price_brl: parseFloat(formData.get('price_brl') as string) || 0,
      type: formData.get('type') || 'regular',
      modules: JSON.stringify([]), // Empty modules array for now
      requirements: [],
      rewards: [],
      is_active: formData.get('is_active') === 'on',
    };

    if (editingCourse) {
      updateCourseMutation.mutate({ id: editingCourse.id, data });
    } else {
      createCourseMutation.mutate(data);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadMediaMutation.mutate(file);
    }
  };

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
              SANCTUM ADMINISTRATORIS
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
              Portal de Controle das Trevas Digitais
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              Centro de <strong className="text-amber-400">comando absoluto</strong> para gerenciar todos os aspectos do 
              <strong className="text-red-400"> Templo do Abismo</strong> digital.
            </p>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Imperium Super Omnia"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                Comando sobre todas as coisas
              </p>
            </div>
          </div>
        </div>

        {/* Admin Interface */}
        <div className="floating-card max-w-7xl w-full bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="p-6">

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-black/40 border border-purple-500/30">
            <TabsTrigger value="dashboard" className="text-amber-400">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="text-amber-400">
              <Users className="w-4 h-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="pages" className="text-amber-400">
              <FileText className="w-4 h-4 mr-2" />
              Páginas
            </TabsTrigger>
            <TabsTrigger value="scriptures" className="text-amber-400">
              <Scroll className="w-4 h-4 mr-2" />
              Escrituras
            </TabsTrigger>
            <TabsTrigger value="courses" className="text-amber-400">
              <BookOpen className="w-4 h-4 mr-2" />
              Cursos
            </TabsTrigger>
            <TabsTrigger value="media" className="text-amber-400">
              <Image className="w-4 h-4 mr-2" />
              Mídia
            </TabsTrigger>
            <TabsTrigger value="system" className="text-amber-400">
              <Settings className="w-4 h-4 mr-2" />
              Sistema
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Usuários</CardTitle>
                  <Users className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-400">
                    {statsLoading ? "..." : (stats.totalUsers || 0)}
                  </div>
                  <p className="text-xs text-gray-500">
                    Membros cadastrados
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Páginas</CardTitle>
                  <FileText className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-400">
                    {Array.isArray(pages) ? pages.length : 0}
                  </div>
                  <p className="text-xs text-gray-500">
                    Páginas criadas
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Escrituras</CardTitle>
                  <Scroll className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-400">
                    {Array.isArray(scriptures) ? scriptures.length : 0}
                  </div>
                  <p className="text-xs text-gray-500">
                    Textos sagrados
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Cursos</CardTitle>
                  <BookOpen className="h-4 w-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-400">
                    {Array.isArray(courses) ? courses.length : 0}
                  </div>
                  <p className="text-xs text-gray-500">
                    Academia ativa
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400">Status do Sistema</CardTitle>
                <CardDescription className="text-gray-400">
                  Monitoramento em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">Portal Online</span>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Ativo
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">Banco de Dados</span>
                    </div>
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      Conectado
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">IA Templo</span>
                    </div>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      Operacional
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400">Gerenciar Usuários</CardTitle>
                <CardDescription className="text-gray-400">
                  {Array.isArray(users) ? users.length : 0} membros cadastrados no templo
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="text-gray-400 mt-2">Carregando usuários...</p>
                  </div>
                ) : Array.isArray(users) && users.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {users.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border border-purple-500/20 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user.username?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-200">{user.username || 'Sem nome'}</p>
                            <p className="text-sm text-gray-400">{user.email || 'Sem email'}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                                {user.role || 'user'}
                              </Badge>
                              <Badge variant="outline" className="text-amber-400">
                                Nível {user.initiation_level || 0}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-8">Nenhum usuário encontrado</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pages Tab */}
          <TabsContent value="pages" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-amber-400">Gerenciar Páginas</CardTitle>
                  <CardDescription className="text-gray-400">
                    Crie e edite páginas do portal
                  </CardDescription>
                </div>
                <Dialog open={showPageDialog} onOpenChange={setShowPageDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => setEditingPage(null)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Página
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-purple-500/30 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-amber-400">
                        {editingPage ? 'Editar Página' : 'Nova Página'}
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Preencha os campos para criar ou editar uma página
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePageSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="title" className="text-gray-300">Título</Label>
                        <Input
                          id="title"
                          name="title"
                          defaultValue={editingPage?.title || ''}
                          className="bg-black/40 border-purple-500/30 text-gray-200"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="slug" className="text-gray-300">Slug (URL)</Label>
                        <Input
                          id="slug"
                          name="slug"
                          defaultValue={editingPage?.slug || ''}
                          className="bg-black/40 border-purple-500/30 text-gray-200"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="content" className="text-gray-300">Conteúdo</Label>
                        <Textarea
                          id="content"
                          name="content"
                          defaultValue={editingPage?.content || ''}
                          className="bg-black/40 border-purple-500/30 text-gray-200 min-h-32"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="status" className="text-gray-300">Status</Label>
                          <Select name="status" defaultValue={editingPage?.status || 'draft'}>
                            <SelectTrigger className="bg-black/40 border-purple-500/30 text-gray-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Rascunho</SelectItem>
                              <SelectItem value="published">Publicado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="type" className="text-gray-300">Tipo</Label>
                          <Select name="type" defaultValue={editingPage?.type || 'page'}>
                            <SelectTrigger className="bg-black/40 border-purple-500/30 text-gray-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="page">Página</SelectItem>
                              <SelectItem value="post">Post</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button 
                          type="submit" 
                          className="bg-purple-600 hover:bg-purple-700"
                          disabled={createPageMutation.isPending || updatePageMutation.isPending}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {editingPage ? 'Atualizar' : 'Criar'}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowPageDialog(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {pagesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="text-gray-400 mt-2">Carregando páginas...</p>
                  </div>
                ) : Array.isArray(pages) && pages.length > 0 ? (
                  <div className="space-y-4">
                    {pages.map((page: any) => (
                      <div key={page.id} className="flex items-center justify-between p-4 border border-purple-500/20 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-200">{page.title}</h4>
                          <p className="text-sm text-gray-400">/{page.slug}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                              {page.status}
                            </Badge>
                            <Badge variant="outline">
                              {page.type}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingPage(page);
                              setShowPageDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {page.status === 'draft' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => publishPageMutation.mutate(page.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deletePageMutation.mutate(page.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-8">Nenhuma página encontrada</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scriptures Tab */}
          <TabsContent value="scriptures" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-amber-400">Gerenciar Escrituras</CardTitle>
                  <CardDescription className="text-gray-400">
                    Textos sagrados e ensinamentos do templo
                  </CardDescription>
                </div>
                <Dialog open={showScriptureDialog} onOpenChange={setShowScriptureDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => setEditingScripture(null)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Escritura
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-purple-500/30 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-amber-400">
                        {editingScripture ? 'Editar Escritura' : 'Nova Escritura'}
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Crie um novo texto sagrado ou edite existente
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleScriptureSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="title" className="text-gray-300">Título</Label>
                        <Input
                          id="title"
                          name="title"
                          defaultValue={editingScripture?.title || ''}
                          className="bg-black/40 border-purple-500/30 text-gray-200"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="slug" className="text-gray-300">Slug</Label>
                        <Input
                          id="slug"
                          name="slug"
                          defaultValue={editingScripture?.slug || ''}
                          className="bg-black/40 border-purple-500/30 text-gray-200"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="content" className="text-gray-300">Conteúdo</Label>
                        <Textarea
                          id="content"
                          name="content"
                          defaultValue={editingScripture?.content || ''}
                          className="bg-black/40 border-purple-500/30 text-gray-200 min-h-32"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="chapter" className="text-gray-300">Capítulo</Label>
                          <Input
                            id="chapter"
                            name="chapter"
                            type="number"
                            defaultValue={editingScripture?.chapter || 1}
                            className="bg-black/40 border-purple-500/30 text-gray-200"
                            min="1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="verse" className="text-gray-300">Versículo</Label>
                          <Input
                            id="verse"
                            name="verse"
                            type="number"
                            defaultValue={editingScripture?.verse || 1}
                            className="bg-black/40 border-purple-500/30 text-gray-200"
                            min="1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category" className="text-gray-300">Categoria</Label>
                          <Select name="category" defaultValue={editingScripture?.category || 'ensinamentos'}>
                            <SelectTrigger className="bg-black/40 border-purple-500/30 text-gray-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ensinamentos">Ensinamentos</SelectItem>
                              <SelectItem value="rituais">Rituais</SelectItem>
                              <SelectItem value="filosofia">Filosofia</SelectItem>
                              <SelectItem value="historia">História</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button 
                          type="submit" 
                          className="bg-red-600 hover:bg-red-700"
                          disabled={createScriptureMutation.isPending || updateScriptureMutation.isPending}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {editingScripture ? 'Atualizar' : 'Criar'}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowScriptureDialog(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {scripturesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="text-gray-400 mt-2">Carregando escrituras...</p>
                  </div>
                ) : Array.isArray(scriptures) && scriptures.length > 0 ? (
                  <div className="space-y-4">
                    {scriptures.map((scripture: any) => (
                      <div key={scripture.id} className="flex items-center justify-between p-4 border border-purple-500/20 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-200">{scripture.title}</h4>
                          <p className="text-sm text-gray-400">Capítulo {scripture.chapter}, Versículo {scripture.verse}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline">
                              {scripture.category}
                            </Badge>
                            <Badge variant={scripture.status === 'published' ? 'default' : 'secondary'}>
                              {scripture.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingScripture(scripture);
                              setShowScriptureDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteScriptureMutation.mutate(scripture.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-8">Nenhuma escritura encontrada</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-amber-400">Gerenciar Cursos</CardTitle>
                  <CardDescription className="text-gray-400">
                    Academia Luciferiana - cursos e módulos
                  </CardDescription>
                </div>
                <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => setEditingCourse(null)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Curso
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-purple-500/30 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-amber-400">
                        {editingCourse ? 'Editar Curso' : 'Novo Curso'}
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Configure um novo curso ou edite existente
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCourseSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="title" className="text-gray-300">Título</Label>
                        <Input
                          id="title"
                          name="title"
                          defaultValue={editingCourse?.title || ''}
                          className="bg-black/40 border-purple-500/30 text-gray-200"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="description" className="text-gray-300">Descrição</Label>
                        <Textarea
                          id="description"
                          name="description"
                          defaultValue={editingCourse?.description || ''}
                          className="bg-black/40 border-purple-500/30 text-gray-200"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="level" className="text-gray-300">Nível</Label>
                          <Select name="level" defaultValue={editingCourse?.level?.toString() || '1'}>
                            <SelectTrigger className="bg-black/40 border-purple-500/30 text-gray-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Iniciante</SelectItem>
                              <SelectItem value="2">Aprendiz</SelectItem>
                              <SelectItem value="3">Avançado</SelectItem>
                              <SelectItem value="4">Adepto</SelectItem>
                              <SelectItem value="5">Mestre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="price_brl" className="text-gray-300">Preço (R$)</Label>
                          <Input
                            id="price_brl"
                            name="price_brl"
                            type="number"
                            step="0.01"
                            defaultValue={editingCourse?.price_brl || 0}
                            className="bg-black/40 border-purple-500/30 text-gray-200"
                            min="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="type" className="text-gray-300">Tipo</Label>
                          <Select name="type" defaultValue={editingCourse?.type || 'regular'}>
                            <SelectTrigger className="bg-black/40 border-purple-500/30 text-gray-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="regular">Regular</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                              <SelectItem value="master">Mestre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_active"
                          name="is_active"
                          defaultChecked={editingCourse?.is_active || false}
                          className="rounded"
                        />
                        <Label htmlFor="is_active" className="text-gray-300">Curso ativo</Label>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button 
                          type="submit" 
                          className="bg-emerald-600 hover:bg-emerald-700"
                          disabled={createCourseMutation.isPending || updateCourseMutation.isPending}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {editingCourse ? 'Atualizar' : 'Criar'}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowCourseDialog(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {coursesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="text-gray-400 mt-2">Carregando cursos...</p>
                  </div>
                ) : Array.isArray(courses) && courses.length > 0 ? (
                  <div className="space-y-4">
                    {courses.map((course: any) => (
                      <div key={course.id} className="flex items-center justify-between p-4 border border-purple-500/20 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-200">{course.title}</h4>
                          <p className="text-sm text-gray-400">{course.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline">
                              Nível {course.level}
                            </Badge>
                            <Badge variant="outline">
                              R$ {course.price_brl}
                            </Badge>
                            <Badge variant={course.is_active ? 'default' : 'secondary'}>
                              {course.is_active ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingCourse(course);
                              setShowCourseDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteCourseMutation.mutate(course.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-8">Nenhum curso encontrado</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-amber-400">Gerenciar Mídia</CardTitle>
                  <CardDescription className="text-gray-400">
                    Upload e gestão de arquivos de mídia
                  </CardDescription>
                </div>
                <Dialog open={showMediaDialog} onOpenChange={setShowMediaDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Mídia
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-purple-500/30">
                    <DialogHeader>
                      <DialogTitle className="text-amber-400">Upload de Mídia</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Selecione um arquivo para upload
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        onChange={handleFileUpload}
                        className="bg-black/40 border-purple-500/30 text-gray-200"
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => setShowMediaDialog(false)}
                        className="w-full"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {mediaLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="text-gray-400 mt-2">Carregando mídia...</p>
                  </div>
                ) : Array.isArray(media) && media.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {media.map((item: any) => (
                      <div key={item.id} className="border border-purple-500/20 rounded-lg p-4">
                        <div className="aspect-video bg-gray-800 rounded mb-2 flex items-center justify-center">
                          {item.type?.startsWith('image/') ? (
                            <img 
                              src={item.url} 
                              alt={item.filename}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="text-gray-400 text-center">
                              <FileText className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-sm">{item.filename}</p>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-200 truncate">
                            {item.filename}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {item.type || 'unknown'}
                            </Badge>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteMediaMutation.mutate(item.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-8">Nenhuma mídia encontrada</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400">Configurações do Sistema</CardTitle>
                <CardDescription className="text-gray-400">
                  Controles administrativos e configurações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-200">Operações</h3>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="w-4 h-4 mr-2" />
                      Backup Banco de Dados
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Verificar Segurança
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurações Gerais
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-200">Status</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Registros Abertos</span>
                        <Badge variant="outline" className="text-green-400">Ativo</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Modo Manutenção</span>
                        <Badge variant="outline" className="text-gray-400">Inativo</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Logs Detalhados</span>
                        <Badge variant="outline" className="text-blue-400">Ativo</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-purple-500/30 pt-6">
                  <div className="p-4 bg-red-950/50 border border-red-500/30 rounded-lg">
                    <h4 className="text-sm font-semibold text-red-400 mb-2">Zona Perigosa</h4>
                    <p className="text-xs text-gray-400 mb-3">
                      Operações que podem afetar o funcionamento do portal
                    </p>
                    <Button variant="destructive" size="sm">
                      Resetar Sistema
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
          </div>
        </div>

          {/* Mystical Quote */}
          <div className="floating-card max-w-2xl mx-auto mt-12 p-8 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg text-gray-300 italic leading-relaxed mb-4">
                "O poder verdadeiro reside no controle absoluto sobre todas as dimensões da realidade"
              </p>
              <p className="text-amber-400 font-semibold">
                — Princípio do Sanctum
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}